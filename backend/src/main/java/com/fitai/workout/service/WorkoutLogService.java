package com.fitai.workout.service;

import com.fitai.workout.dto.WorkoutLogRequest;
import com.fitai.workout.dto.WorkoutLogResponse;
import com.fitai.workout.entity.Exercise;
import com.fitai.workout.entity.User;
import com.fitai.workout.entity.WorkoutDay;
import com.fitai.workout.entity.WorkoutLog;
import com.fitai.workout.repository.ExerciseRepository;
import com.fitai.workout.repository.UserRepository;
import com.fitai.workout.repository.WorkoutDayRepository;
import com.fitai.workout.repository.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutDayRepository workoutDayRepository;

    @Transactional
    public WorkoutLogResponse logWorkout(String email, WorkoutLogRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found: " + request.getExerciseId()));

        WorkoutDay workoutDay = null;
        if (request.getWorkoutDayId() != null) {
            workoutDay = workoutDayRepository.findById(request.getWorkoutDayId())
                    .orElse(null);
        }

        // Check historical max weight for PR logic
        Double previousMax = workoutLogRepository
                .findMaxWeightForUserAndExerciseBeforeDate(user.getId(), exercise.getId(), request.getDate())
                .orElse(0.0);

        List<WorkoutLogResponse.SetLogResponse> setResponses = new ArrayList<>();

        for (WorkoutLogRequest.SetLogRequest setReq : request.getSets()) {
            boolean isPr = setReq.getWeightLifted() > previousMax;

            WorkoutLog log = WorkoutLog.builder()
                    .user(user)
                    .exercise(exercise)
                    .date(request.getDate())
                    .workoutDay(workoutDay)
                    .setNumber(setReq.getSetNumber())
                    .reps(setReq.getReps())
                    .weightLifted(setReq.getWeightLifted())
                    .isPersonalRecord(isPr)
                    .build();

            log = workoutLogRepository.save(log);

            setResponses.add(WorkoutLogResponse.SetLogResponse.builder()
                    .id(log.getId())
                    .setNumber(log.getSetNumber())
                    .reps(log.getReps())
                    .weightLifted(log.getWeightLifted())
                    .isPersonalRecord(log.getIsPersonalRecord())
                    .build());

            // Update previous max so only the first set that breaks the record gets the
            // flag
            if (isPr) {
                previousMax = setReq.getWeightLifted();
            }
        }

        return WorkoutLogResponse.builder()
                .exerciseName(exercise.getName())
                .exerciseId(exercise.getId())
                .date(request.getDate())
                .sets(setResponses)
                .build();
    }

    public List<WorkoutLogResponse> getWorkoutHistoryByDate(String email, LocalDate date) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WorkoutLog> logs = workoutLogRepository.findByUserIdAndDateOrderBySetNumberAsc(user.getId(), date);

        // Group by exercise
        Map<Exercise, List<WorkoutLog>> logsByExercise = logs.stream()
                .collect(Collectors.groupingBy(WorkoutLog::getExercise));

        List<WorkoutLogResponse> responses = new ArrayList<>();
        for (Map.Entry<Exercise, List<WorkoutLog>> entry : logsByExercise.entrySet()) {
            Exercise ex = entry.getKey();
            List<WorkoutLogResponse.SetLogResponse> setResponses = entry.getValue().stream()
                    .map(l -> WorkoutLogResponse.SetLogResponse.builder()
                            .id(l.getId())
                            .setNumber(l.getSetNumber())
                            .reps(l.getReps())
                            .weightLifted(l.getWeightLifted())
                            .isPersonalRecord(l.getIsPersonalRecord() != null && l.getIsPersonalRecord())
                            .build())
                    .collect(Collectors.toList());

            responses.add(WorkoutLogResponse.builder()
                    .exerciseName(ex.getName())
                    .exerciseId(ex.getId())
                    .date(date)
                    .sets(setResponses)
                    .build());
        }

        return responses;
    }

    public List<WorkoutLogResponse> getExerciseProgress(String email, Long exerciseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WorkoutLog> logs = workoutLogRepository.findByUserIdAndExerciseIdOrderByDateAscSetNumberAsc(user.getId(),
                exerciseId);

        // Group by Date for chart data
        Map<LocalDate, List<WorkoutLog>> logsByDate = logs.stream()
                .collect(Collectors.groupingBy(WorkoutLog::getDate));

        List<WorkoutLogResponse> responses = new ArrayList<>();
        if (logs.isEmpty()) {
            return responses;
        }

        Exercise ex = logs.get(0).getExercise();

        for (Map.Entry<LocalDate, List<WorkoutLog>> entry : logsByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<WorkoutLogResponse.SetLogResponse> setResponses = entry.getValue().stream()
                    .map(l -> WorkoutLogResponse.SetLogResponse.builder()
                            .id(l.getId())
                            .setNumber(l.getSetNumber())
                            .reps(l.getReps())
                            .weightLifted(l.getWeightLifted())
                            .isPersonalRecord(l.getIsPersonalRecord() != null && l.getIsPersonalRecord())
                            .build())
                    // Fix sorting within date group
                    .sorted((s1, s2) -> s1.getSetNumber().compareTo(s2.getSetNumber()))
                    .collect(Collectors.toList());

            responses.add(WorkoutLogResponse.builder()
                    .exerciseName(ex.getName())
                    .exerciseId(ex.getId())
                    .date(date)
                    .sets(setResponses)
                    .build());
        }

        // Sort by Date to ensure chart is chronological
        responses.sort((r1, r2) -> r1.getDate().compareTo(r2.getDate()));

        return responses;
    }

    public List<LocalDate> getWorkoutDates(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return workoutLogRepository.findDistinctDatesByUserId(user.getId());
    }
}
