package com.fitai.workout.service;

import com.fitai.workout.dto.WorkoutPlanResponse;
import com.fitai.workout.dto.WorkoutPreferenceRequest;
import com.fitai.workout.entity.*;
import com.fitai.workout.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutEngineService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutPreferenceRepository workoutPreferenceRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkoutPreference savePreference(String email, WorkoutPreferenceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPreference pref = WorkoutPreference.builder()
                .user(user)
                .level(request.getLevel())
                .goal(request.getGoal())
                .daysPerWeek(request.getDaysPerWeek())
                .equipment(request.getEquipment())
                .targetMuscleGroups(request.getTargetMuscleGroups())
                .build();

        return workoutPreferenceRepository.save(pref);
    }

    @Transactional
    public WorkoutPlanResponse generatePlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPreference pref = workoutPreferenceRepository.findTopByUserIdOrderByIdDesc(user.getId())
                .orElseThrow(() -> new RuntimeException("No preferences found. Please set your preferences first."));

        // Determine allowed difficulty levels based on fitness level
        List<Exercise.Difficulty> allowedDifficulties = getAllowedDifficulties(pref.getLevel());

        // Create muscle group splits for the week
        List<List<Exercise.MuscleGroup>> daySplits = createDaySplits(
                pref.getTargetMuscleGroups(), pref.getDaysPerWeek());

        // Build the workout plan
        WorkoutPlan plan = WorkoutPlan.builder()
                .user(user)
                .planName(generatePlanName(pref))
                .warmupSuggestion(getWarmupSuggestion(pref.getGoal()))
                .cooldownSuggestion(getCooldownSuggestion(pref.getGoal()))
                .build();

        List<WorkoutDay> workoutDays = new ArrayList<>();

        for (int dayIndex = 0; dayIndex < daySplits.size(); dayIndex++) {
            List<Exercise.MuscleGroup> dayMuscles = daySplits.get(dayIndex);
            String label = dayMuscles.stream()
                    .map(mg -> capitalize(mg.name()))
                    .collect(Collectors.joining(" + "));

            WorkoutDay day = WorkoutDay.builder()
                    .workoutPlan(plan)
                    .dayNumber(dayIndex + 1)
                    .muscleGroupLabel("Day " + (dayIndex + 1) + " – " + label)
                    .build();

            List<WorkoutExercise> dayExercises = new ArrayList<>();
            int orderIndex = 0;

            for (Exercise.MuscleGroup muscle : dayMuscles) {
                List<Exercise> available = findExercises(muscle, pref.getEquipment(), allowedDifficulties);
                int exercisesPerGroup = getExercisesPerGroup(pref.getGoal(), pref.getLevel());
                List<Exercise> selected = selectExercises(available, exercisesPerGroup);

                for (Exercise ex : selected) {
                    int[] setsReps = getSetsAndReps(pref.getGoal(), pref.getLevel(), ex);
                    int rest = getRestTime(pref.getGoal());

                    WorkoutExercise we = WorkoutExercise.builder()
                            .workoutDay(day)
                            .exercise(ex)
                            .sets(setsReps[0])
                            .reps(setsReps[1])
                            .restTimeSeconds(rest)
                            .orderIndex(orderIndex++)
                            .build();
                    dayExercises.add(we);
                }
            }

            day.setExercises(dayExercises);
            workoutDays.add(day);
        }

        plan.setWorkoutDays(workoutDays);
        plan = workoutPlanRepository.save(plan);

        return mapToResponse(plan);
    }

    public WorkoutPlanResponse getLatestPlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPlan plan = workoutPlanRepository.findTopByUserIdOrderByGeneratedDateDesc(user.getId())
                .orElseThrow(() -> new RuntimeException("No workout plan found. Generate one first."));

        return mapToResponse(plan);
    }

    public List<WorkoutPlanResponse> getAllPlans(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return workoutPlanRepository.findByUserIdOrderByGeneratedDateDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void toggleDayCompletion(Long dayId) {
        WorkoutDay day = workoutPlanRepository.findAll().stream()
                .flatMap(p -> p.getWorkoutDays().stream())
                .filter(d -> d.getId().equals(dayId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Day not found"));
        day.setCompleted(!day.getCompleted());
    }

    // -- Helper methods --

    private List<Exercise.Difficulty> getAllowedDifficulties(WorkoutPreference.FitnessLevel level) {
        return switch (level) {
            case BEGINNER -> List.of(Exercise.Difficulty.BEGINNER);
            case INTERMEDIATE -> List.of(Exercise.Difficulty.BEGINNER, Exercise.Difficulty.INTERMEDIATE);
            case PROFESSIONAL ->
                List.of(Exercise.Difficulty.BEGINNER, Exercise.Difficulty.INTERMEDIATE, Exercise.Difficulty.ADVANCED);
        };
    }

    private List<List<Exercise.MuscleGroup>> createDaySplits(List<Exercise.MuscleGroup> muscles, int days) {
        List<List<Exercise.MuscleGroup>> splits = new ArrayList<>();

        if (muscles.size() <= days) {
            // Spread muscles across days, filling extra days with repeated groups
            for (int i = 0; i < days; i++) {
                splits.add(List.of(muscles.get(i % muscles.size())));
            }
        } else {
            // Group muscles into days
            int groupSize = (int) Math.ceil((double) muscles.size() / days);
            for (int i = 0; i < days; i++) {
                int start = i * groupSize;
                int end = Math.min(start + groupSize, muscles.size());
                if (start < muscles.size()) {
                    splits.add(new ArrayList<>(muscles.subList(start, end)));
                }
            }
        }

        return splits;
    }

    private List<Exercise> findExercises(Exercise.MuscleGroup muscle, Exercise.Equipment equipment,
            List<Exercise.Difficulty> difficulties) {
        List<Exercise> exercises = exerciseRepository.findByMuscleGroupAndEquipmentAndDifficultyIn(
                muscle, equipment, difficulties);

        // Fallback: if no exercises found with specific equipment, try all equipment
        if (exercises.isEmpty()) {
            exercises = exerciseRepository.findByMuscleGroupAndDifficultyIn(muscle, difficulties);
        }

        return exercises;
    }

    private int getExercisesPerGroup(WorkoutPreference.Goal goal, WorkoutPreference.FitnessLevel level) {
        int base = switch (level) {
            case BEGINNER -> 2;
            case INTERMEDIATE -> 3;
            case PROFESSIONAL -> 4;
        };

        return switch (goal) {
            case MUSCLE_GAIN -> base + 1;
            case STRENGTH -> base;
            case FAT_LOSS -> base;
            case ENDURANCE -> base - 1;
        };
    }

    private List<Exercise> selectExercises(List<Exercise> available, int count) {
        if (available.isEmpty())
            return List.of();
        List<Exercise> shuffled = new ArrayList<>(available);
        Collections.shuffle(shuffled);
        return shuffled.subList(0, Math.min(count, shuffled.size()));
    }

    private int[] getSetsAndReps(WorkoutPreference.Goal goal, WorkoutPreference.FitnessLevel level, Exercise ex) {
        int sets = ex.getDefaultSets() != null ? ex.getDefaultSets() : 3;
        int reps = ex.getDefaultReps() != null ? ex.getDefaultReps() : 10;

        return switch (goal) {
            case MUSCLE_GAIN -> new int[] { sets + 1, reps };
            case STRENGTH -> new int[] { sets + 2, Math.max(reps - 4, 4) };
            case FAT_LOSS -> new int[] { sets, reps + 5 };
            case ENDURANCE -> new int[] { sets, reps + 8 };
        };
    }

    private int getRestTime(WorkoutPreference.Goal goal) {
        return switch (goal) {
            case STRENGTH -> 120;
            case MUSCLE_GAIN -> 90;
            case FAT_LOSS -> 45;
            case ENDURANCE -> 30;
        };
    }

    private String generatePlanName(WorkoutPreference pref) {
        return pref.getLevel().name().charAt(0) + pref.getLevel().name().substring(1).toLowerCase()
                + " " + pref.getGoal().name().replace("_", " ")
                + " - " + pref.getDaysPerWeek() + " Day Split";
    }

    private String getWarmupSuggestion(WorkoutPreference.Goal goal) {
        return switch (goal) {
            case MUSCLE_GAIN, STRENGTH ->
                "5-10 min light cardio (jogging/cycling), dynamic stretches (arm circles, leg swings, hip rotations), 2 warm-up sets of your first exercise at 50% weight.";
            case FAT_LOSS ->
                "10 min brisk walking or jump rope, high knees, butt kicks, dynamic stretches to elevate heart rate.";
            case ENDURANCE -> "10 min light jog, mobility drills, dynamic full-body stretches, build pace gradually.";
        };
    }

    private String getCooldownSuggestion(WorkoutPreference.Goal goal) {
        return switch (goal) {
            case MUSCLE_GAIN, STRENGTH ->
                "5 min light walking, static stretching for targeted muscle groups (hold 30s each), foam rolling if available.";
            case FAT_LOSS ->
                "5 min slow walk to bring heart rate down, full-body static stretches, deep breathing exercises.";
            case ENDURANCE ->
                "5-10 min gradual cooldown walk, comprehensive stretching routine, focus on hip flexors and calves.";
        };
    }

    private String capitalize(String s) {
        return s.charAt(0) + s.substring(1).toLowerCase();
    }

    private WorkoutPlanResponse mapToResponse(WorkoutPlan plan) {
        return WorkoutPlanResponse.builder()
                .id(plan.getId())
                .planName(plan.getPlanName())
                .generatedDate(plan.getGeneratedDate())
                .warmupSuggestion(plan.getWarmupSuggestion())
                .cooldownSuggestion(plan.getCooldownSuggestion())
                .days(plan.getWorkoutDays().stream().map(day -> WorkoutPlanResponse.WorkoutDayResponse.builder()
                        .id(day.getId())
                        .dayNumber(day.getDayNumber())
                        .muscleGroupLabel(day.getMuscleGroupLabel())
                        .completed(day.getCompleted())
                        .exercises(day.getExercises().stream()
                                .map(we -> WorkoutPlanResponse.WorkoutExerciseResponse.builder()
                                        .id(we.getId())
                                        .exerciseName(we.getExercise().getName())
                                        .muscleGroup(we.getExercise().getMuscleGroup().name())
                                        .difficulty(we.getExercise().getDifficulty().name())
                                        .description(we.getExercise().getDescription())
                                        .sets(we.getSets())
                                        .reps(we.getReps())
                                        .restTimeSeconds(we.getRestTimeSeconds())
                                        .build())
                                .collect(Collectors.toList()))
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
