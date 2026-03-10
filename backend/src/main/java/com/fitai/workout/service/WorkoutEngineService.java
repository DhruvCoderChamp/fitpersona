package com.fitai.workout.service;

import com.fitai.workout.dto.*;
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
                .gender(request.getGender())
                .level(request.getLevel())
                .goal(request.getGoal())
                .daysPerWeek(request.getDaysPerWeek())
                .equipment(request.getEquipment())
                .targetMuscleGroups(request.getTargetMuscleGroups())
                .build();

        return workoutPreferenceRepository.save(pref);
    }

    @Transactional
    public WorkoutPlanResponse createManualPlan(String email, ManualWorkoutPlanRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPlan plan = WorkoutPlan.builder()
                .user(user)
                .planName(request.getPlanName())
                .generatedDate(java.time.LocalDate.now())
                .build();

        List<WorkoutDay> workoutDays = new ArrayList<>();
        for (ManualWorkoutPlanRequest.ManualWorkoutDayRequest dayReq : request.getDays()) {
            String label = dayReq.getMuscleGroupLabel() != null && !dayReq.getMuscleGroupLabel().isEmpty()
                    ? dayReq.getMuscleGroupLabel()
                    : "Day " + dayReq.getDayNumber();

            WorkoutDay day = WorkoutDay.builder()
                    .workoutPlan(plan)
                    .dayNumber(dayReq.getDayNumber())
                    .muscleGroupLabel(label)
                    .completed(false)
                    .build();

            List<WorkoutExercise> exercises = new ArrayList<>();
            int orderIndex = 0;
            for (ManualWorkoutPlanRequest.ManualWorkoutExerciseRequest exReq : dayReq.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exReq.getExerciseId())
                        .orElseThrow(() -> new RuntimeException("Exercise not found: " + exReq.getExerciseId()));

                WorkoutExercise we = WorkoutExercise.builder()
                        .workoutDay(day)
                        .exercise(exercise)
                        .sets(exReq.getSets())
                        .reps(exReq.getReps())
                        .restTimeSeconds(exReq.getRestTimeSeconds())
                        .orderIndex(orderIndex++)
                        .build();
                exercises.add(we);
            }
            day.setExercises(exercises);
            workoutDays.add(day);
        }

        plan.setWorkoutDays(workoutDays);
        plan = workoutPlanRepository.save(plan);

        return mapToResponse(plan);
    }

    @Transactional
    public WorkoutPlanResponse generatePlan(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WorkoutPreference pref = workoutPreferenceRepository.findTopByUserIdOrderByIdDesc(user.getId())
                .orElseThrow(() -> new RuntimeException("No preferences found. Please set your preferences first."));

        // Determine gender (fallback to user's profile gender)
        String gender = pref.getGender() != null ? pref.getGender() : user.getGender();
        boolean isFemale = "FEMALE".equalsIgnoreCase(gender);

        // Allowed difficulty levels based on fitness level
        // PRENATAL_SAFE always uses BEGINNER only — no matter what level was picked
        List<Exercise.Difficulty> allowedDifficulties =
                (pref.getGoal() == WorkoutPreference.Goal.PRENATAL_SAFE)
                ? List.of(Exercise.Difficulty.BEGINNER)
                : getAllowedDifficulties(pref.getLevel());

        // Muscle group splits for the week
        List<List<Exercise.MuscleGroup>> daySplits = createDaySplits(
                pref.getTargetMuscleGroups(), pref.getDaysPerWeek());

        // Build the workout plan
        WorkoutPlan plan = WorkoutPlan.builder()
                .user(user)
                .planName(generatePlanName(pref, gender))
                .warmupSuggestion(getWarmupSuggestion(pref.getGoal(), isFemale))
                .cooldownSuggestion(getCooldownSuggestion(pref.getGoal(), isFemale))
                .build();

        List<WorkoutDay> workoutDays = new ArrayList<>();

        // Track used exercise IDs globally across ALL days to avoid repetition
        Set<Long> usedExerciseIds = new HashSet<>();

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
                // For prenatal safe goal, use dedicated prenatal exercise finder
                boolean isPrenatal = pref.getGoal() == WorkoutPreference.Goal.PRENATAL_SAFE;
                List<Exercise> available = isPrenatal
                        ? findPrenatalExercises(muscle)
                        : findExercises(muscle, pref.getEquipment(), allowedDifficulties);
                int exercisesPerGroup = getExercisesPerGroup(pref.getGoal(), pref.getLevel(), isFemale);
                List<Exercise> selected = selectUniqueExercises(available, exercisesPerGroup, usedExerciseIds);

                for (Exercise ex : selected) {
                    usedExerciseIds.add(ex.getId());
                    int[] setsReps = getSetsAndReps(pref.getGoal(), pref.getLevel(), ex, isFemale);
                    int rest = getRestTime(pref.getGoal(), isFemale);

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

        WorkoutPlan plan = workoutPlanRepository.findTopByUserIdOrderByIdDesc(user.getId())
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

    // ── Helper methods ────────────────────────────────────────────────────────

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
            for (int i = 0; i < days; i++) {
                splits.add(List.of(muscles.get(i % muscles.size())));
            }
        } else {
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

        if (exercises.isEmpty()) {
            exercises = exerciseRepository.findByMuscleGroupAndDifficultyIn(muscle, difficulties);
        }

        return exercises;
    }

    /**
     * For PRENATAL_SAFE: first tries to find exercises whose name starts with "Prenatal"
     * for that muscle group (ignoring equipment type since prenatal exercises are HOME/NO_EQUIPMENT).
     * Falls back to general BEGINNER exercises for the muscle group if needed.
     */
    private List<Exercise> findPrenatalExercises(Exercise.MuscleGroup muscle) {
        // Get all BEGINNER exercises for this muscle group, any equipment
        List<Exercise> all = exerciseRepository.findByMuscleGroupAndDifficultyIn(
                muscle, List.of(Exercise.Difficulty.BEGINNER));

        // Priority: exercises with "Prenatal" in the name
        List<Exercise> prenatal = all.stream()
                .filter(e -> e.getName().startsWith("Prenatal") || e.getName().startsWith("Kegel"))
                .collect(java.util.stream.Collectors.toList());

        // If we have prenatal-specific ones, use them; otherwise fall back to any BEGINNER
        return prenatal.isEmpty() ? all : prenatal;
    }

    private int getExercisesPerGroup(WorkoutPreference.Goal goal, WorkoutPreference.FitnessLevel level,
            boolean isFemale) {
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
            // Women-specific: lighter volume, more variety
            case TONING -> base;
            case FLEXIBILITY -> Math.max(base - 1, 1);
            case POSTURE -> Math.max(base - 1, 1);
            case PRENATAL_SAFE -> Math.max(base - 1, 1);
        };
    }

    private List<Exercise> selectExercises(List<Exercise> available, int count) {
        if (available.isEmpty())
            return List.of();
        List<Exercise> shuffled = new ArrayList<>(available);
        Collections.shuffle(shuffled);
        return shuffled.subList(0, Math.min(count, shuffled.size()));
    }

    /**
     * Selects exercises that have NOT been used yet (globally across the whole plan).
     * Falls back to allowing re-use if the pool is exhausted.
     */
    private List<Exercise> selectUniqueExercises(List<Exercise> available, int count,
            Set<Long> usedExerciseIds) {
        if (available.isEmpty())
            return List.of();

        // First try to pick only from unused exercises
        List<Exercise> unused = available.stream()
                .filter(ex -> !usedExerciseIds.contains(ex.getId()))
                .collect(Collectors.toList());

        // If not enough unused, allow re-use as a fallback
        List<Exercise> pool = unused.size() >= count ? unused : available;

        List<Exercise> shuffled = new ArrayList<>(pool);
        Collections.shuffle(shuffled);
        return shuffled.subList(0, Math.min(count, shuffled.size()));
    }

    private int[] getSetsAndReps(WorkoutPreference.Goal goal, WorkoutPreference.FitnessLevel level, Exercise ex,
            boolean isFemale) {
        int sets = ex.getDefaultSets() != null ? ex.getDefaultSets() : 3;
        int reps = ex.getDefaultReps() != null ? ex.getDefaultReps() : 10;

        // For female users, generally slightly lower weights, higher reps
        int femaleRepBonus = isFemale ? 3 : 0;

        return switch (goal) {
            case MUSCLE_GAIN -> new int[]{ sets + 1, reps + femaleRepBonus };
            case STRENGTH -> new int[]{ sets + 2, Math.max(reps - 4, 4) };
            case FAT_LOSS -> new int[]{ sets, reps + 5 + femaleRepBonus };
            case ENDURANCE -> new int[]{ sets, reps + 8 + femaleRepBonus };
            // Women-specific goals: moderate sets, higher reps with lighter weight
            case TONING -> new int[]{ 3, 15 + femaleRepBonus };
            case FLEXIBILITY -> new int[]{ 2, 12 };
            case POSTURE -> new int[]{ 3, 12 };
            case PRENATAL_SAFE -> new int[]{ 2, 10 };
        };
    }

    private int getRestTime(WorkoutPreference.Goal goal, boolean isFemale) {
        return switch (goal) {
            case STRENGTH -> 120;
            case MUSCLE_GAIN -> 90;
            case FAT_LOSS -> 45;
            case ENDURANCE -> 30;
            case TONING -> 45;
            case FLEXIBILITY -> 30;
            case POSTURE -> 45;
            case PRENATAL_SAFE -> 60;
        };
    }

    private String generatePlanName(WorkoutPreference pref, String gender) {
        String levelStr = capitalize(pref.getLevel().name());
        String goalStr = pref.getGoal().name().replace("_", " ");
        String genderTag = "FEMALE".equalsIgnoreCase(gender) ? "Women's " : "";
        return genderTag + levelStr + " " + goalStr + " – " + pref.getDaysPerWeek() + " Day Split";
    }

    private String getWarmupSuggestion(WorkoutPreference.Goal goal, boolean isFemale) {
        return switch (goal) {
            case MUSCLE_GAIN, STRENGTH ->
                "5-10 min light cardio (jogging/cycling), dynamic stretches (arm circles, leg swings, hip rotations), 2 warm-up sets of your first exercise at 50% weight.";
            case FAT_LOSS ->
                "10 min brisk walking or jump rope, high knees, butt kicks, dynamic stretches to elevate heart rate.";
            case ENDURANCE -> "10 min light jog, mobility drills, dynamic full-body stretches, build pace gradually.";
            // Women-specific warmups
            case TONING ->
                "5-8 min brisk walk or light elliptical, bodyweight squats × 15, hip circles, arm swings to get the blood flowing.";
            case FLEXIBILITY ->
                "5 min gentle walking, neck rolls, shoulder rolls, cat-cow stretches on all fours, light forward folds.";
            case POSTURE ->
                "5 min marching in place, gentle thoracic rotations, chin tucks, shoulder blade squeezes, hip flexor stretches.";
            case PRENATAL_SAFE ->
                "5-8 min easy walking or light marching, gentle pelvic tilts, ankle circles, cat-cow breathing exercises. Always check with your doctor.";
        };
    }

    private String getCooldownSuggestion(WorkoutPreference.Goal goal, boolean isFemale) {
        return switch (goal) {
            case MUSCLE_GAIN, STRENGTH ->
                "5 min light walking, static stretching for targeted muscle groups (hold 30s each), foam rolling if available.";
            case FAT_LOSS ->
                "5 min slow walk to bring heart rate down, full-body static stretches, deep breathing exercises.";
            case ENDURANCE ->
                "5-10 min gradual cooldown walk, comprehensive stretching routine, focus on hip flexors and calves.";
            // Women-specific cooldowns
            case TONING ->
                "5 min light walking, full-body static stretches focusing on glutes, hamstrings and inner thighs. Foam roll the legs. Deep belly breathing.";
            case FLEXIBILITY ->
                "10 min full static stretching: pigeon pose, seated forward fold, butterfly stretch, side stretches. Hold each 40-60 sec.";
            case POSTURE ->
                "Child's pose (1 min), doorway chest stretch, seated hamstring stretch, standing quad stretch. Focus on breathing into each stretch.";
            case PRENATAL_SAFE ->
                "Gentle side-lying stretch, seated cat-cow, kegel exercises, ankle rotations, 5 min slow walking. Stay hydrated and rest as needed.";
        };
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
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
                                        .gifUrl(we.getExercise().getGifUrl())
                                        .instructions(we.getExercise().getInstructions())
                                        .commonMistakes(we.getExercise().getCommonMistakes())
                                        .baseExerciseId(we.getExercise().getId())
                                        .build())
                                .collect(Collectors.toList()))
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
