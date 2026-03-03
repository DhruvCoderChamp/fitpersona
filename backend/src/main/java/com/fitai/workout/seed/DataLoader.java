package com.fitai.workout.seed;

import com.fitai.workout.entity.Exercise;
import com.fitai.workout.entity.Exercise.*;
import com.fitai.workout.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) {
        if (exerciseRepository.count() > 0) {
            log.info("Exercises already loaded, skipping seed.");
            return;
        }

        log.info("Seeding exercise database...");

        List<Exercise> exercises = List.of(
                // ===== CHEST =====
                ex("Bench Press", MuscleGroup.CHEST, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Classic barbell bench press targeting the pectorals", 4, 10, 90),
                ex("Incline Dumbbell Press", MuscleGroup.CHEST, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Upper chest focused dumbbell press on an incline bench", 3, 12, 90),
                ex("Decline Bench Press", MuscleGroup.CHEST, Difficulty.ADVANCED, Equipment.GYM,
                        "Targets the lower chest on a decline angle", 3, 10, 90),
                ex("Cable Fly", MuscleGroup.CHEST, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Cable crossover fly for chest isolation", 3, 15, 60),
                ex("Dumbbell Fly", MuscleGroup.CHEST, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Flat bench dumbbell fly for chest stretch", 3, 12, 60),
                ex("Push-Up", MuscleGroup.CHEST, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Standard push-up targeting chest, shoulders, triceps", 3, 15, 60),
                ex("Incline Push-Up", MuscleGroup.CHEST, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Easier push-up variant with hands elevated", 3, 15, 60),
                ex("Diamond Push-Up", MuscleGroup.CHEST, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Close-grip push-up emphasizing inner chest and triceps", 3, 12, 60),
                ex("Chest Dip", MuscleGroup.CHEST, Difficulty.ADVANCED, Equipment.GYM,
                        "Leaning forward dip targeting the lower chest", 3, 10, 90),
                ex("Resistance Band Chest Press", MuscleGroup.CHEST, Difficulty.BEGINNER, Equipment.HOME,
                        "Chest press using resistance bands", 3, 15, 60),
                ex("Floor Press", MuscleGroup.CHEST, Difficulty.BEGINNER, Equipment.HOME,
                        "Lying on the floor with dumbbells for a partial range press", 3, 12, 60),

                // ===== TRICEPS =====
                ex("Tricep Pushdown", MuscleGroup.TRICEPS, Difficulty.BEGINNER, Equipment.GYM,
                        "Cable tricep pushdown with rope or bar attachment", 3, 15, 60),
                ex("Close-Grip Bench Press", MuscleGroup.TRICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Narrow grip bench press emphasizing triceps", 4, 10, 90),
                ex("Overhead Tricep Extension", MuscleGroup.TRICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Dumbbell or cable overhead extension for long head", 3, 12, 60),
                ex("Skull Crushers", MuscleGroup.TRICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Lying EZ-bar tricep extension", 3, 12, 60),
                ex("Tricep Kickback", MuscleGroup.TRICEPS, Difficulty.BEGINNER, Equipment.HOME,
                        "Dumbbell kickback isolating the tricep", 3, 15, 60),
                ex("Bench Dip", MuscleGroup.TRICEPS, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Tricep dips using a chair or bench", 3, 15, 60),
                ex("Bodyweight Tricep Extension", MuscleGroup.TRICEPS, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Using a bar or surface to perform bodyweight skull crushers", 3, 12, 60),
                ex("Band Tricep Pushdown", MuscleGroup.TRICEPS, Difficulty.BEGINNER, Equipment.HOME,
                        "Resistance band tricep pushdown alternative", 3, 15, 60),

                // ===== BICEPS =====
                ex("Barbell Curl", MuscleGroup.BICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Standing barbell curl for bicep mass", 3, 12, 60),
                ex("Dumbbell Curl", MuscleGroup.BICEPS, Difficulty.BEGINNER, Equipment.HOME,
                        "Alternating dumbbell curl", 3, 12, 60),
                ex("Hammer Curl", MuscleGroup.BICEPS, Difficulty.BEGINNER, Equipment.HOME,
                        "Neutral grip dumbbell curl targeting brachialis", 3, 12, 60),
                ex("Preacher Curl", MuscleGroup.BICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Isolation curl on a preacher bench", 3, 12, 60),
                ex("Concentration Curl", MuscleGroup.BICEPS, Difficulty.INTERMEDIATE, Equipment.HOME,
                        "Seated single-arm curl with elbow on thigh", 3, 12, 60),
                ex("Cable Curl", MuscleGroup.BICEPS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Standing cable curl for constant tension", 3, 15, 60),
                ex("Chin-Up", MuscleGroup.BICEPS, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Underhand grip pull-up emphasizing biceps", 3, 8, 90),
                ex("Band Bicep Curl", MuscleGroup.BICEPS, Difficulty.BEGINNER, Equipment.HOME,
                        "Resistance band curl for bicep activation", 3, 15, 60),
                ex("Incline Dumbbell Curl", MuscleGroup.BICEPS, Difficulty.ADVANCED, Equipment.GYM,
                        "Curl on incline bench for full stretch", 3, 10, 60),

                // ===== BACK =====
                ex("Deadlift", MuscleGroup.BACK, Difficulty.ADVANCED, Equipment.GYM,
                        "Conventional deadlift targeting entire posterior chain", 4, 6, 120),
                ex("Barbell Row", MuscleGroup.BACK, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Bent-over barbell row for mid-back thickness", 4, 10, 90),
                ex("Lat Pulldown", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.GYM,
                        "Wide-grip lat pulldown for lat width", 3, 12, 60),
                ex("Seated Cable Row", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.GYM,
                        "Cable row for mid-back and rhomboids", 3, 12, 60),
                ex("Pull-Up", MuscleGroup.BACK, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Overhand grip pull-up for lat development", 3, 8, 90),
                ex("T-Bar Row", MuscleGroup.BACK, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "T-bar row for back thickness", 3, 10, 90),
                ex("Single-Arm Dumbbell Row", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.HOME,
                        "One-arm row on a bench for unilateral back work", 3, 12, 60),
                ex("Face Pull", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.GYM,
                        "Cable face pull for rear delts and upper back", 3, 15, 60),
                ex("Superman Hold", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Lying prone and lifting arms/legs for lower back", 3, 15, 45),
                ex("Resistance Band Row", MuscleGroup.BACK, Difficulty.BEGINNER, Equipment.HOME,
                        "Seated row using resistance bands", 3, 15, 60),
                ex("Inverted Row", MuscleGroup.BACK, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Body row under a bar or table", 3, 12, 60),

                // ===== SHOULDERS =====
                ex("Overhead Press", MuscleGroup.SHOULDERS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Standing barbell overhead press", 4, 8, 90),
                ex("Dumbbell Shoulder Press", MuscleGroup.SHOULDERS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Seated or standing dumbbell press", 3, 10, 90),
                ex("Lateral Raise", MuscleGroup.SHOULDERS, Difficulty.BEGINNER, Equipment.HOME,
                        "Dumbbell lateral raise for side delts", 3, 15, 60),
                ex("Front Raise", MuscleGroup.SHOULDERS, Difficulty.BEGINNER, Equipment.HOME,
                        "Dumbbell front raise for anterior delts", 3, 15, 60),
                ex("Rear Delt Fly", MuscleGroup.SHOULDERS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Bent-over or machine rear delt fly", 3, 15, 60),
                ex("Arnold Press", MuscleGroup.SHOULDERS, Difficulty.ADVANCED, Equipment.GYM,
                        "Rotating dumbbell press hitting all delt heads", 3, 10, 90),
                ex("Pike Push-Up", MuscleGroup.SHOULDERS, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Inverted V push-up targeting the shoulders", 3, 10, 60),
                ex("Band Shoulder Press", MuscleGroup.SHOULDERS, Difficulty.BEGINNER, Equipment.HOME,
                        "Overhead press using resistance bands", 3, 15, 60),
                ex("Upright Row", MuscleGroup.SHOULDERS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Barbell or dumbbell upright row", 3, 12, 60),
                ex("Handstand Push-Up", MuscleGroup.SHOULDERS, Difficulty.ADVANCED, Equipment.NO_EQUIPMENT,
                        "Against-wall handstand push-up for advanced athletes", 3, 6, 120),

                // ===== LEGS =====
                ex("Barbell Squat", MuscleGroup.LEGS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Back squat with barbell for overall leg development", 4, 8, 120),
                ex("Leg Press", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.GYM,
                        "Machine leg press for quads and glutes", 4, 12, 90),
                ex("Romanian Deadlift", MuscleGroup.LEGS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Stiff-leg deadlift targeting hamstrings and glutes", 3, 10, 90),
                ex("Leg Extension", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.GYM,
                        "Machine isolation for quadriceps", 3, 15, 60),
                ex("Leg Curl", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.GYM,
                        "Machine isolation for hamstrings", 3, 15, 60),
                ex("Calf Raise", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.GYM,
                        "Standing or seated calf raise", 4, 15, 45),
                ex("Bodyweight Squat", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Standard bodyweight squat", 3, 20, 60),
                ex("Walking Lunge", MuscleGroup.LEGS, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Alternating lunges for quads and glutes", 3, 12, 60),
                ex("Bulgarian Split Squat", MuscleGroup.LEGS, Difficulty.INTERMEDIATE, Equipment.HOME,
                        "Rear foot elevated single-leg squat", 3, 10, 90),
                ex("Goblet Squat", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.HOME,
                        "Front-loaded squat holding a dumbbell", 3, 12, 60),
                ex("Pistol Squat", MuscleGroup.LEGS, Difficulty.ADVANCED, Equipment.NO_EQUIPMENT,
                        "Single-leg squat for advanced balance and strength", 3, 6, 90),
                ex("Hip Thrust", MuscleGroup.LEGS, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Barbell hip thrust for glute activation", 4, 10, 90),
                ex("Step-Up", MuscleGroup.LEGS, Difficulty.BEGINNER, Equipment.HOME,
                        "Dumbbell step-up using a box or step", 3, 12, 60),

                // ===== CORE =====
                ex("Plank", MuscleGroup.CORE, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Isometric hold for core stability", 3, 30, 45),
                ex("Crunch", MuscleGroup.CORE, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Standard abdominal crunch", 3, 20, 45),
                ex("Russian Twist", MuscleGroup.CORE, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Seated twist for obliques, can add weight", 3, 20, 45),
                ex("Hanging Leg Raise", MuscleGroup.CORE, Difficulty.ADVANCED, Equipment.GYM,
                        "Hanging from a bar and raising legs for lower abs", 3, 12, 60),
                ex("Cable Woodchop", MuscleGroup.CORE, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Rotational cable movement for obliques", 3, 12, 60),
                ex("Ab Wheel Rollout", MuscleGroup.CORE, Difficulty.ADVANCED, Equipment.HOME,
                        "Using an ab wheel for full core engagement", 3, 10, 60),
                ex("Mountain Climber", MuscleGroup.CORE, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Dynamic core exercise alternating knee to chest", 3, 20, 45),
                ex("Bicycle Crunch", MuscleGroup.CORE, Difficulty.INTERMEDIATE, Equipment.NO_EQUIPMENT,
                        "Alternating elbow-to-knee crunch for obliques", 3, 20, 45),
                ex("Dead Bug", MuscleGroup.CORE, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Lying anti-extension exercise for core stability", 3, 12, 45),
                ex("Flutter Kicks", MuscleGroup.CORE, Difficulty.BEGINNER, Equipment.NO_EQUIPMENT,
                        "Lying leg flutter kicks for lower abs", 3, 20, 45),
                ex("Dragon Flag", MuscleGroup.CORE, Difficulty.ADVANCED, Equipment.NO_EQUIPMENT,
                        "Advanced full-body lever for extreme core strength", 3, 6, 90),
                ex("Pallof Press", MuscleGroup.CORE, Difficulty.INTERMEDIATE, Equipment.GYM,
                        "Anti-rotation cable press for core stability", 3, 12, 60));

        exerciseRepository.saveAll(exercises);
        log.info("Seeded {} exercises successfully.", exercises.size());
    }

    private Exercise ex(String name, MuscleGroup mg, Difficulty diff, Equipment eq,
            String desc, int sets, int reps, int rest) {
        return Exercise.builder()
                .name(name)
                .muscleGroup(mg)
                .difficulty(diff)
                .equipment(eq)
                .description(desc)
                .defaultSets(sets)
                .defaultReps(reps)
                .defaultRestSeconds(rest)
                .build();
    }
}
