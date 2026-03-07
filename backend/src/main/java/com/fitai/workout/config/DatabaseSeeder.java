package com.fitai.workout.config;

import com.fitai.workout.entity.Exercise;
import com.fitai.workout.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    private static final Map<String, String> EXERCISE_GIFS = Map.ofEntries(
            Map.entry("Pushups", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/PUSH-UP.gif"),
            Map.entry("Squats", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif"),
            Map.entry("Jumping Jacks", "https://www.fitnessprogramer.com/wp-content/uploads/2023/09/Jumping-Jacks.gif"),
            Map.entry("Pullups", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/PULL-UP.gif"),
            Map.entry("Bench Press",
                    "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-BENCH-PRESS.gif"),
            Map.entry("Lunges", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/DUMBBELL-LUNGE.gif"),
            Map.entry("Lateral Raise",
                    "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif"),
            Map.entry("Bicep Curls", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif"),
            Map.entry("Tricep Dips", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif"),
            Map.entry("Deadlift", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-DEADLIFT.gif"),
            Map.entry("Shoulder Press",
                    "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/DUMBBELL-SHOULDER-PRESS.gif"),
            Map.entry("Plank", "https://www.fitnessprogramer.com/wp-content/uploads/2021/05/Plank.gif"),
            Map.entry("Crunches", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/CRUNCH.gif"),
            Map.entry("Leg Press", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/LEG-PRESS.gif"),
            Map.entry("Chest Fly", "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif"),
            Map.entry("Dumbbell Row",
                    "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-One-Arm-Row.gif"));

    @Override
    public void run(String... args) {
        log.info("Checking for exercises to update with GIFs...");
        EXERCISE_GIFS.forEach((name, url) -> {
            Optional<Exercise> exOpt = exerciseRepository.findByName(name);
            if (exOpt.isPresent()) {
                Exercise ex = exOpt.get();
                ex.setGifUrl(url);
                if (ex.getInstructions() == null)
                    ex.setInstructions("Keep your core tight and maintain proper form throughout the movement.");
                exerciseRepository.save(ex);
                log.info("Updated GIF and instructions for exercise: {}", name);
            } else {
                Exercise newEx = Exercise.builder()
                        .name(name)
                        .muscleGroup(guessMuscleGroup(name))
                        .difficulty(Exercise.Difficulty.BEGINNER)
                        .equipment(Exercise.Equipment.GYM)
                        .description("Essential exercise for " + guessMuscleGroup(name).name().toLowerCase() + ".")
                        .instructions(
                                "1. Stabilize your body.\n2. Execute the movement slowly.\n3. Breathe out on the exertion.")
                        .commonMistakes("Using momentum instead of muscle control; Arching the back.")
                        .gifUrl(url)
                        .defaultSets(3)
                        .defaultReps(12)
                        .defaultRestSeconds(60)
                        .build();
                exerciseRepository.save(newEx);
                log.info("Created new animated exercise: {}", name);
            }
        });
    }

    private Exercise.MuscleGroup guessMuscleGroup(String name) {
        String lower = name.toLowerCase();
        if (lower.contains("push") || lower.contains("bench") || lower.contains("fly") || lower.contains("chest"))
            return Exercise.MuscleGroup.CHEST;
        if (lower.contains("squat") || lower.contains("lunge") || lower.contains("leg"))
            return Exercise.MuscleGroup.LEGS;
        if (lower.contains("pull") || lower.contains("row") || lower.contains("curl") && lower.contains("back")
                || lower.contains("deadlift"))
            return Exercise.MuscleGroup.BACK;
        if (lower.contains("press") || lower.contains("lateral") || lower.contains("shoulder"))
            return Exercise.MuscleGroup.SHOULDERS;
        if (lower.contains("curl") || lower.contains("bicep"))
            return Exercise.MuscleGroup.BICEPS;
        if (lower.contains("dip") || lower.contains("tricep"))
            return Exercise.MuscleGroup.TRICEPS;
        if (lower.contains("plank") || lower.contains("crunch") || lower.contains("core"))
            return Exercise.MuscleGroup.CORE;
        return Exercise.MuscleGroup.CORE;
    }
}
