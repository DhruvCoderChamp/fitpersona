package com.fitai.workout.config;

import com.fitai.workout.entity.Exercise;
import com.fitai.workout.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) {
        log.info("Seeding exercise database...");
        seedAll();
        log.info("Exercise seeding complete. Total exercises: {}", exerciseRepository.count());
    }

    private void seed(String name, Exercise.MuscleGroup mg, Exercise.Difficulty diff,
            Exercise.Equipment eq, int sets, int reps, int rest,
            String desc, String instructions, String mistakes, String gifUrl) {
        Optional<Exercise> existing = exerciseRepository.findByName(name);
        if (existing.isPresent()) {
            Exercise ex = existing.get();
            if (gifUrl != null && ex.getGifUrl() == null) {
                ex.setGifUrl(gifUrl);
                exerciseRepository.save(ex);
            }
            return;
        }
        exerciseRepository.save(Exercise.builder()
                .name(name).muscleGroup(mg).difficulty(diff).equipment(eq)
                .defaultSets(sets).defaultReps(reps).defaultRestSeconds(rest)
                .description(desc).instructions(instructions).commonMistakes(mistakes)
                .gifUrl(gifUrl).build());
        log.info("Seeded: {}", name);
    }

    private void seedAll() {

        // ══════════════════════════════════════════════════════════════════
        // CHEST — 12 exercises across all levels + equipment
        // ══════════════════════════════════════════════════════════════════

        seed("Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 60,
                "Classic bodyweight chest exercise for beginners.",
                "1. Place hands shoulder-width apart.\n2. Keep body straight like a plank.\n3. Lower chest to near floor.\n4. Push back up explosively.\n5. Breathe out on the push.",
                "Sagging hips; Flaring elbows too wide; Incomplete range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/PUSH-UP.gif");

        seed("Incline Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Easier push-up variation using an elevated surface.",
                "1. Place hands on bench/chair at shoulder width.\n2. Body forms a straight line.\n3. Lower chest toward bench.\n4. Push back up.\n5. Keep core braced throughout.",
                "Dropping the hips; Not going through full range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Ups.gif");

        seed("Wide-Grip Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 60,
                "Wider hand placement targets the outer chest more.",
                "1. Set hands wider than shoulder-width.\n2. Lower chest between hands.\n3. Push back up, squeezing chest at the top.",
                "Collapsing core; Hands too far forward.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2022/02/Wide-Push-Up.gif");

        seed("Bench Press", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 10, 90,
                "The king of chest exercises using a barbell.",
                "1. Lie flat, grip barbell just wider than shoulder-width.\n2. Unrack and lower bar to mid-chest.\n3. Press powerfully to lockout.\n4. Keep feet flat and arch natural.",
                "Bouncing bar off chest; Flaring elbows 90°; Not retracting scapula.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-BENCH-PRESS.gif");

        seed("Dumbbell Bench Press", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 10, 90,
                "Greater range of motion than barbell bench press.",
                "1. Lie on bench, dumbbells at chest level.\n2. Press up until arms are nearly straight.\n3. Lower slowly with control.\n4. Feel the stretch at the bottom.",
                "Dropping dumbbells too fast; Not bringing them to same height.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Bench-Press.gif");

        seed("Chest Fly", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 75,
                "Isolation exercise for the chest using dumbbells.",
                "1. Lie on bench, dumbbells above chest.\n2. Open arms in wide arc, elbows slightly bent.\n3. Squeeze chest to bring dumbbells back together.\n4. Do not overreach.",
                "Straightening arms fully; Using too much weight; Arching back excessively.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif");

        seed("Cable Chest Fly", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 60,
                "Cable version provides constant tension on the chest.",
                "1. Set cables at shoulder height.\n2. Step forward, arms slightly bent.\n3. Bring hands together in front of chest.\n4. Slowly return to start.",
                "Letting the weight yank arms back; Leaning too far forward.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Crossover.gif");

        seed("Incline Dumbbell Press", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 10, 90,
                "Targets the upper chest at a 30-45° incline.",
                "1. Set bench to 30-45°.\n2. Press dumbbells up from shoulder level.\n3. Lower with control.\n4. Feel upper chest contracting.",
                "Using momentum; Bench angle too steep (turns into shoulder exercise).",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Dumbbell-Press.gif");

        seed("Decline Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 60,
                "Feet elevated push-up hitting upper chest.",
                "1. Place feet on bench or chair.\n2. Hands on floor, shoulder-width.\n3. Lower chest toward floor.\n4. Push back up.",
                "Raising hips; Incomplete depth.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Decline-Push-Up.gif");

        seed("Barbell Incline Bench Press", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                5, 6, 120,
                "Heavy compound upper chest exercise.",
                "1. Set bench to 30°.\n2. Grip barbell slightly wider than shoulder-width.\n3. Lower to upper chest.\n4. Press explosively.\n5. Control the descent.",
                "Bar path too vertical; Excessive arch; Incomplete range.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Barbell-Bench-Press.gif");

        seed("Diamond Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.ADVANCED, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 75,
                "Narrow-grip push-up hitting inner chest and triceps.",
                "1. Form diamond shape with thumbs and index fingers.\n2. Lower chest to hands.\n3. Push back up.\n4. Elbows track back, not flared.",
                "Elbows flaring out; Sagging hips; Hands too far from body.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Diamond-Push-Up.gif");

        seed("Chest Dips", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                3, 10, 90,
                "Dips with forward lean emphasize lower chest.",
                "1. Lean forward slightly on parallel bars.\n2. Lower until upper arms parallel to floor.\n3. Press back up.\n4. Maintain forward tilt.",
                "No forward lean (shifts to triceps); Going too deep straining shoulders.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif");

        // Women-friendly chest exercises
        seed("Kneeling Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Easier push-up variation great for beginners and women.",
                "1. Kneel on floor, hands shoulder-width apart.\n2. Lower chest toward floor.\n3. Push back up.\n4. Keep hips slightly forward.",
                "Arching back; Hips breaking the straight line.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Knee-Push-Up.gif");

        seed("Resistance Band Chest Press", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 15, 45,
                "Chest press using resistance band, joint-friendly.",
                "1. Anchor band behind you at chest height.\n2. Press hands forward until arms extend.\n3. Slowly return.\n4. Squeeze chest at the end position.",
                "Letting band snap back; Uneven tension on both sides.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Resistance-Band-Chest-Press.gif");

        // ══════════════════════════════════════════════════════════════════
        // BACK — 12 exercises
        // ══════════════════════════════════════════════════════════════════

        seed("Pull-Up", Exercise.MuscleGroup.BACK, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 8, 90,
                "Classic compound back exercise using bodyweight.",
                "1. Hang from bar, palms facing away, shoulder-width.\n2. Pull yourself up until chin clears bar.\n3. Lower under control.\n4. Fully extend at bottom.",
                "Using momentum (kipping); Incomplete range; Shrugging shoulders.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/PULL-UP.gif");

        seed("Assisted Pull-Up", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 10, 75,
                "Uses machine assistance to help perform pull-ups.",
                "1. Set counterweight on machine.\n2. Kneel on pad, grab bar.\n3. Pull up until chin clears bar.\n4. Lower slowly.",
                "Too much assistance removing the challenge; Not full extension at bottom.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Assisted-Pull-Up.gif");

        seed("Lat Pulldown", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 75,
                "Cable machine exercise targeting the lats.",
                "1. Sit with thighs under pad, grip wide.\n2. Pull bar to upper chest.\n3. Lean back slightly.\n4. Control return.",
                "Pulling behind the neck; Leaning too far back; Using momentum.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Lat-Pulldown.gif");

        seed("Barbell Row", Exercise.MuscleGroup.BACK, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 8, 90,
                "Heavy compound movement for back thickness.",
                "1. Hinge at hips, back flat, bar hanging.\n2. Pull bar to lower chest/upper abdomen.\n3. Squeeze shoulder blades.\n4. Lower under control.",
                "Rounding the lower back; Using leg drive excessively; Bar path too high.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Barbell-Row.gif");

        seed("Dumbbell Row", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Unilateral back exercise for balance and lat development.",
                "1. Support with one knee and hand on bench.\n2. Pull dumbbell to hip, elbow brushing side.\n3. Squeeze at top.\n4. Lower fully.",
                "Rotating torso; Elbow flaring out; Not full range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-One-Arm-Row.gif");

        seed("Seated Cable Row", Exercise.MuscleGroup.BACK, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 75,
                "Cable row for mid-back and lat development.",
                "1. Sit upright, grip cable handle.\n2. Pull to abdomen, elbows in.\n3. Squeeze back.\n4. Return with control.",
                "Rounding back on the eccentric; Leaning back excessively.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Cable-Row.gif");

        seed("Deadlift", Exercise.MuscleGroup.BACK, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                4, 6, 120,
                "The king of compound lifts — full posterior chain.",
                "1. Stand with bar over mid-foot.\n2. Grip just outside legs, back flat.\n3. Drive through floor, hips and shoulders rise together.\n4. Lock out at top.\n5. Hip hinge to return.",
                "Rounding the lower back; Bar away from body; Jerking the bar off the floor.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-DEADLIFT.gif");

        seed("Romanian Deadlift", Exercise.MuscleGroup.BACK, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 10, 90,
                "Hip hinge movement targeting hamstrings and lower back.",
                "1. Stand with dumbbells/bar in hands.\n2. Push hips back, lower weight along legs.\n3. Feel hamstring stretch.\n4. Drive hips forward to stand.",
                "Rounding lower back; Bending knees too much; Not hinging at hips.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Romanian-Deadlift.gif");

        seed("Superman Hold", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 45,
                "Bodyweight lower back extension exercise.",
                "1. Lie face down, arms extended overhead.\n2. Lift arms and legs simultaneously.\n3. Hold 2 seconds at top.\n4. Lower slowly.",
                "Holding breath; Over-extending the neck; Rushing the movement.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Superman.gif");

        seed("Inverted Row", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Bodyweight row using a bar set at waist height.",
                "1. Lie under a bar, grip wider than shoulder-width.\n2. Keep body straight, pull chest to bar.\n3. Lower under control.",
                "Hips sagging; Bar too high (too easy); Short range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Inverted-Row.gif");

        seed("Face Pull", Exercise.MuscleGroup.BACK, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 15, 60,
                "Cable exercise for rear deltoids and upper back.",
                "1. Set cable at head height, use rope attachment.\n2. Pull rope to face, elbows high.\n3. Separate hands at the end.\n4. Control the return.",
                "Too heavy a weight; Elbows dropping below shoulder height.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Face-Pull.gif");

        seed("T-Bar Row", Exercise.MuscleGroup.BACK, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                4, 8, 90,
                "Heavy compound exercise for back thickness and width.",
                "1. Stand over bar, hinge at hips.\n2. Grip bar, pull to lower chest.\n3. Squeeze shoulder blades at the top.\n4. Lower with control.",
                "Rounding back; Jerking the weight; Incomplete range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/T-Bar-Row.gif");

        // ══════════════════════════════════════════════════════════════════
        // LEGS — 14 exercises (extra because legs have glutes, quads, hamstrings)
        // ══════════════════════════════════════════════════════════════════

        seed("Bodyweight Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Foundational leg exercise with no equipment.",
                "1. Feet shoulder-width, toes slightly out.\n2. Push hips back and down.\n3. Lower until thighs parallel to floor.\n4. Drive through heels to stand.",
                "Knees caving in; Heels rising off floor; Leaning too far forward.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Bodyweight-Squat.gif");

        seed("Barbell Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 8, 120,
                "The foundational leg exercise for strength and mass.",
                "1. Bar across upper back, feet shoulder-width.\n2. Brace core, squat until parallel or below.\n3. Drive through heels to stand.\n4. Keep chest up throughout.",
                "Knees caving in; Heels rising; Forward lean; Shallow depth.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif");

        seed("Dumbbell Lunge", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Walking lunges with dumbbells for unilateral leg strength.",
                "1. Hold dumbbells at sides.\n2. Step forward, lower back knee toward floor.\n3. Front thigh parallel to floor.\n4. Push through front heel to recover.",
                "Front knee going past toes; Leaning too far forward; Short stride.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/DUMBBELL-LUNGE.gif");

        seed("Leg Press", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 10, 90,
                "Machine exercise for quads, hamstrings, and glutes.",
                "1. Sit in machine, feet shoulder-width on platform.\n2. Release safety, lower sled until knees at 90°.\n3. Press through heels to extend.\n4. Don't lock out knees.",
                "Knees caving; Too shallow range; Pressing with toes; Locking out knees.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/LEG-PRESS.gif");

        seed("Glute Bridge", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Glute-focused exercise lying on the floor. Great for women.",
                "1. Lie on back, knees bent, feet flat.\n2. Drive hips toward ceiling, squeezing glutes.\n3. Hold 1 second at top.\n4. Lower with control.",
                "Using lower back instead of glutes; Feet too far or too close.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Glute-Bridge.gif");

        seed("Hip Thrust", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 12, 75,
                "Best exercise for glute development. Popular with women.",
                "1. Upper back on bench, bar over hips.\n2. Drive hips up, squeezing glutes at top.\n3. Pause 1 second.\n4. Lower slowly.",
                "Not using full range of motion; Bar rolling; Hyperextending the lumbar.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Hip-Thrust.gif");

        seed("Romanian Deadlift (Legs)", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 10, 90,
                "Targets hamstrings and glutes with a hip hinge.",
                "1. Stand holding bar/dumbbells.\n2. Hinge hips back, arms slide down legs.\n3. Feel deep hamstring stretch.\n4. Drive hips forward to return.",
                "Rounding lower back; Squatting instead of hinging; Bar drifting from body.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Romanian-Deadlift.gif");

        seed("Leg Curl", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Machine isolation for hamstrings.",
                "1. Lie face down on machine.\n2. Curl weight up until near glutes.\n3. Squeeze at top.\n4. Lower slowly.",
                "Lifting hips off pad; Using momentum; Not full range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Lying-Leg-Curl.gif");

        seed("Leg Extension", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Machine quad isolation exercise.",
                "1. Sit in machine, feet behind pad.\n2. Extend legs until straight.\n3. Hold 1 second.\n4. Lower slowly.",
                "Using too much weight causing knee pain; Incomplete range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Leg-Extension.gif");

        seed("Step-Up", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 45,
                "Unilateral leg exercise using a bench or step.",
                "1. Stand facing bench/step.\n2. Step up with one foot, drive knee up.\n3. Step back down.\n4. Alternate or complete one side.",
                "Pushing off back foot; Not fully extending the standing leg.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Step-Up.gif");

        seed("Sumo Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Wide-stance squat targeting inner thighs and glutes. Great for women.",
                "1. Stand wide, toes pointed out 45°.\n2. Lower between legs, keeping chest up.\n3. Drive through heels to stand.\n4. Squeeze glutes at the top.",
                "Knees caving in; Torso leaning forward excessively.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Sumo-Squat.gif");

        seed("Front Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                4, 6, 120,
                "Bar across front shoulders, heavy quad emphasis.",
                "1. Clean or step bar onto front delts.\n2. Elbows high, upright torso.\n3. Squat deep, knees tracking toes.\n4. Drive up through mid-foot.",
                "Elbows dropping; Rounding upper back; Allowing heels to rise.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Front-Squat.gif");

        seed("Bulgarian Split Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                3, 10, 90,
                "Rear-foot elevated split squat for unilateral strength.",
                "1. Rear foot on bench, front foot forward.\n2. Lower rear knee toward floor.\n3. Front thigh parallel at bottom.\n4. Drive through front heel.",
                "Front foot too close to bench; Knee caving in; Leaning too far forward.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Bulgarian-Split-Squat.gif");

        seed("Calf Raise", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 20, 30,
                "Isolation exercise for the calf muscles.",
                "1. Stand on edge of step.\n2. Drop heels below step level.\n3. Rise up on toes as high as possible.\n4. Lower slowly.",
                "Bouncing; Partial range of motion; Rushing the movement.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Calf-Raise.gif");

        // ══════════════════════════════════════════════════════════════════
        // SHOULDERS — 10 exercises
        // ══════════════════════════════════════════════════════════════════

        seed("Dumbbell Shoulder Press", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 75,
                "Foundational overhead pressing for shoulder development.",
                "1. Sit/stand, dumbbells at ear level.\n2. Press overhead until arms extend.\n3. Lower with control to start.\n4. Don't lock elbows at top.",
                "Arching lower back excessively; Pressing forward instead of overhead.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/DUMBBELL-SHOULDER-PRESS.gif");

        seed("Barbell Overhead Press", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 8, 90,
                "Standing overhead press for full shoulder activation.",
                "1. Bar across front delts, grip shoulder-width.\n2. Brace core, press overhead.\n3. Bar moves in a slight arc to clear face.\n4. Lower to clavicle level.",
                "Leaning back excessively; Bar path forward; Flared elbows.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Barbell-Overhead-Press.gif");

        seed("Lateral Raise", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 15, 60,
                "Isolation for lateral deltoids — builds shoulder width.",
                "1. Hold dumbbells at sides.\n2. Raise arms out to sides until parallel to floor.\n3. Thumbs slightly higher than pinkies (pour glass).\n4. Lower slowly.",
                "Using momentum; Shrugging shoulders; Going too heavy.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif");

        seed("Front Raise", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Targets the anterior (front) deltoid.",
                "1. Hold dumbbells in front of thighs.\n2. Raise one or both arms to shoulder height.\n3. Hold briefly at top.\n4. Lower with control.",
                "Swinging the weights; Going above shoulder height; Rotating torso.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Front-Raise.gif");

        seed("Reverse Fly", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 15, 60,
                "Targets rear deltoids and upper back.",
                "1. Hinge forward 45°, dumbbells hanging.\n2. Open arms to sides, leading with elbows.\n3. Squeeze rear delts at top.\n4. Lower with control.",
                "Lifting with momentum; Not maintaining the hinge; Using too much weight.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Bent-Over-Rear-Delt-Fly.gif");

        seed("Arnold Press", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 10, 75,
                "Rotating press that hits all three deltoid heads.",
                "1. Start with dumbbells at chin height, palms facing you.\n2. Rotate palms out as you press up.\n3. At top palms face forward.\n4. Reverse on way down.",
                "Rushing the rotation; Incomplete range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Arnold-Press.gif");

        seed("Upright Row", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 75,
                "Compound movement for traps and lateral deltoids.",
                "1. Hold bar/dumbbells in front of thighs.\n2. Pull straight up to chin, elbows leading.\n3. Hold at top.\n4. Lower slowly.",
                "Pulling elbows too high (shoulder impingement); Grip too narrow.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Upright-Row.gif");

        seed("Cable Lateral Raise", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 15, 60,
                "Cable version for constant tension on lateral deltoids.",
                "1. Stand beside cable, grip single handle.\n2. Raise arm to shoulder height.\n3. Keep slight bend in elbow.\n4. Lower slowly.",
                "Using momentum; Torso rotation to assist; Not reaching full height.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Lateral-Raise.gif");

        seed("Pike Push-Up", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 60,
                "Bodyweight shoulder press variation — great for beginners.",
                "1. Form inverted V with hips high.\n2. Bend elbows, lower head toward floor.\n3. Push back up.\n4. Keep core engaged.",
                "Hips dropping; Head not going to floor level; Elbows flaring.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Pike-Push-Up.gif");

        seed("Handstand Push-Up", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.ADVANCED, Exercise.Equipment.NO_EQUIPMENT,
                3, 6, 90,
                "Advanced bodyweight shoulder press against a wall.",
                "1. Kick up into handstand against wall.\n2. Lower head toward floor, elbows at 45°.\n3. Press back to full extension.\n4. Control the movement.",
                "Elbows flaring too wide; Rushing; Not using wall for balance.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Wall-Handstand-Push-Up.gif");

        // ══════════════════════════════════════════════════════════════════
        // BICEPS — 9 exercises
        // ══════════════════════════════════════════════════════════════════

        seed("Dumbbell Bicep Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Classic dumbbell curl for bicep development.",
                "1. Stand with dumbbells at sides.\n2. Curl up, rotating palms up as you lift.\n3. Full contraction at top.\n4. Lower fully to stretch.",
                "Swinging elbows forward; Short range of motion; Too much weight.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif");

        seed("Barbell Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                4, 10, 75,
                "Barbell curl for maximum bicep loading.",
                "1. Grip bar shoulder-width, supinated grip.\n2. Curl bar to shoulders.\n3. Squeeze at top.\n4. Lower fully with control.",
                "Elbows drifting forward; Back swinging; Bar not lowered fully.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Barbell-Curl.gif");

        seed("Hammer Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Neutral grip curl hitting the brachialis and forearms.",
                "1. Hold dumbbells with neutral (hammer) grip.\n2. Curl up, thumbs facing ceiling.\n3. Full contraction at top.\n4. Lower fully.",
                "Swinging elbows; Using momentum; Partial range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Hammer-Curl.gif");

        seed("Incline Dumbbell Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 10, 75,
                "Arms hang behind torso for maximum bicep stretch.",
                "1. Sit on incline bench (45-60°).\n2. Arms hang naturally, curl up.\n3. Full contraction.\n4. Slowly lower to full extension.",
                "Bench angle too upright; Elbows drifting forward; Partial range.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Dumbbell-Curl.gif");

        seed("Cable Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 60,
                "Constant tension curl using cable machine.",
                "1. Face cable machine, low pulley.\n2. Grip bar, curl up.\n3. Full peak contraction.\n4. Lower slowly.",
                "Using momentum; Short range; Leaning back.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Bicep-Curl.gif");

        seed("Concentration Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 60,
                "Seated curl with elbow braced on thigh for isolation.",
                "1. Sit, elbow braced inner thigh.\n2. Curl dumbbell up, full contraction.\n3. Squeeze at top.\n4. Lower fully.",
                "Not bracing the elbow; Twisting wrist incorrectly; Going too heavy.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Concentration-Curl.gif");

        seed("Resistance Band Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 15, 45,
                "Bicep curl with resistance band — great for home.",
                "1. Stand on band, grip handles.\n2. Curl up to shoulders.\n3. Control the lowering.",
                "Band too long without enough tension; Elbow movement.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Resistance-Band-Bicep-Curl.gif");

        seed("Chin-Up", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 8, 90,
                "Supinated grip pull-up heavily targeting biceps.",
                "1. Hang with palms facing toward you.\n2. Pull chest to bar.\n3. Lower with full control.",
                "Kipping; Short range; Shrugging shoulders.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Chin-Up.gif");

        seed("21s Dumbbell Curl", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                3, 21, 90,
                "7 bottom-half + 7 top-half + 7 full range of motion curls.",
                "1. 7 reps from bottom to halfway.\n2. 7 reps from halfway to top.\n3. 7 full reps.\n4. No rest between segments.",
                "Too heavy a weight; Rushing segments; Elbow movement.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/21s-Curl.gif");

        // ══════════════════════════════════════════════════════════════════
        // TRICEPS — 9 exercises
        // ══════════════════════════════════════════════════════════════════

        seed("Tricep Dips", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 75,
                "Bodyweight tricep exercise using parallel bars or bench.",
                "1. Hands on bars/bench, arms straight.\n2. Lower until upper arms parallel.\n3. Press back up to extension.\n4. Keep body upright for tricep focus.",
                "Leaning forward (shifts to chest); Incomplete range; Going too deep.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif");

        seed("Overhead Tricep Extension", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 12, 60,
                "Dumbbell overhead press targeting the long head of triceps.",
                "1. Hold dumbbell overhead with both hands.\n2. Lower behind head, elbows in.\n3. Extend back up.\n4. Keep upper arms still.",
                "Elbows flaring; Upper arms moving; Going too heavy.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Overhead-Tricep-Extension.gif");

        seed("Skull Crusher", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 10, 75,
                "Lying barbell tricep extension for mass.",
                "1. Lie on bench, bar above face.\n2. Lower bar to forehead, elbows in.\n3. Extend arms back.\n4. Control the negative.",
                "Elbows flaring; Using too much weight; Bar path too far back.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Skull-Crusher.gif");

        seed("Tricep Pushdown", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 15, 60,
                "Cable pushdown for tricep isolation.",
                "1. Stand at cable, grip bar at chest height.\n2. Push down until arms fully extended.\n3. Squeeze at bottom.\n4. Control return.",
                "Elbows drifting forward; Leaning into it; Short range of motion.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Tricep-Pushdown.gif");

        seed("Rope Pushdown", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 60,
                "Cable pushdown using rope to hit both tricep heads.",
                "1. Grip rope at chest height.\n2. Push down and spread rope outward at bottom.\n3. Squeeze hard.\n4. Control return.",
                "Elbows rising; Not spreading rope at bottom; Short range.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Rope-Pushdown.gif");

        seed("Close-Grip Bench Press", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                4, 8, 90,
                "Barbell bench with narrow grip to target triceps.",
                "1. Grip bar shoulder-width or slightly narrower.\n2. Lower to lower chest.\n3. Press up, elbows staying in.\n4. Full lockout at top.",
                "Grip too narrow (wrist pain); Elbows flaring; Incomplete lockout.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Close-Grip-Bench-Press.gif");

        seed("Tricep Kickback", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.GYM,
                3, 15, 45,
                "Isolation exercise for the tricep with dumbbell.",
                "1. Hinge forward, upper arm parallel to floor.\n2. Extend forearm back until straight.\n3. Squeeze at extension.\n4. Return with control.",
                "Upper arm dropping; Using momentum; Incomplete extension.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Tricep-Kickback.gif");

        seed("Diamond Push-Up (Triceps)", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 60,
                "Narrow push-up variation targeting triceps with bodyweight.",
                "1. Hands form diamond shape under chest.\n2. Lower body keeping elbows close to sides.\n3. Push back up fully.",
                "Elbows flaring; Hips sagging; Hands placed too far forward.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Diamond-Push-Up.gif");

        seed("Resistance Band Tricep Extension", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 15, 45,
                "Overhead tricep extension with resistance band for home.",
                "1. Stand on band, bring band overhead.\n2. Extend arms up from behind head.\n3. Lower slowly.",
                "Not anchoring band securely; Elbows drifting out.",
                null);

        // ══════════════════════════════════════════════════════════════════
        // CORE — 12 exercises
        // ══════════════════════════════════════════════════════════════════

        seed("Plank", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 30, 45,
                "Isometric core exercise holding a straight-body position.",
                "1. Forearms on floor, elbows under shoulders.\n2. Body forms straight line.\n3. Hold position, breathe steadily.\n4. Don't let hips sag or rise.",
                "Hips sagging or piking; Holding breath; Neck extended.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/05/Plank.gif");

        seed("Crunches", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 20, 45,
                "Classic abdominal exercise for upper abs.",
                "1. Lie on back, knees bent.\n2. Hands behind head, curl shoulders up.\n3. Exhale at the top.\n4. Lower slowly.",
                "Pulling neck with hands; Raising lower back off floor; Rushing.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/CRUNCH.gif");

        seed("Bicycle Crunch", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 20, 45,
                "Rotational crunch targeting obliques and abs.",
                "1. Lie on back, hands by ears.\n2. Alternate touching elbow to opposite knee.\n3. Keep unused leg extended.\n4. Controlled rotation.",
                "Pulling neck; Rushing the rotation; Not extending the offside leg.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Bicycle-Crunch.gif");

        seed("Leg Raise", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 60,
                "Lower ab isolation exercise.",
                "1. Lie on back, legs straight.\n2. Raise legs to 90°.\n3. Lower slowly, don't touch floor.\n4. Keep lower back pressed down.",
                "Arching lower back; Bending knees; Dropping legs too fast.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Leg-Raise.gif");

        seed("Russian Twist", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 20, 45,
                "Rotational core exercise for obliques.",
                "1. Sit with knees bent, lean back 45°.\n2. Rotate torso side to side.\n3. Feet can be elevated for difficulty.\n4. Hold weight for added challenge.",
                "Rounding back; Feet touching floor; Only rotating arms not torso.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Russian-Twist.gif");

        seed("Mountain Climbers", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 30, 45,
                "Dynamic core exercise also raising heart rate.",
                "1. Start in push-up position.\n2. Drive alternating knees toward chest rapidly.\n3. Keep hips level.\n4. Maintain plank alignment.",
                "Hips rising; Slow movement without rhythm; Neck tension.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Mountain-Climber.gif");

        seed("Dead Bug", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 60,
                "Anti-extension core exercise great for lower back health.",
                "1. Lie on back, arms up, knees at 90°.\n2. Lower opposite arm and leg simultaneously.\n3. Keep lower back pressed to floor.\n4. Return and alternate.",
                "Arching lower back; Holding breath; Moving too fast.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Dead-Bug.gif");

        seed("Hollow Body Hold", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.NO_EQUIPMENT,
                3, 30, 45,
                "Gymnastics-inspired core compression exercise.",
                "1. Lie on back.\n2. Lift shoulders and legs off floor.\n3. Arms overhead or at sides.\n4. Spine rounded slightly.\n5. Hold position.",
                "Lower back arching; Raising legs too high; Holding breath.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Hollow-Hold.gif");

        seed("Ab Wheel Rollout", Exercise.MuscleGroup.CORE, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                3, 10, 90,
                "Challenging anti-extension exercise for the core.",
                "1. Kneel, hold ab wheel in front.\n2. Roll out slowly until body nearly parallel.\n3. Pull back using core.\n4. Don't let hips drop.",
                "Hips sagging; Going too far; Using hip flexors instead of core.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Ab-Wheel-Rollout.gif");

        seed("Dragon Flag", Exercise.MuscleGroup.CORE, Exercise.Difficulty.ADVANCED, Exercise.Equipment.GYM,
                3, 6, 90,
                "Advanced bodyweight core exercise targeting entire anterior chain.",
                "1. Lie on bench, grip above head.\n2. Push hips up into shoulder stand.\n3. Lower stiff body slowly.\n4. Return without touching bench.",
                "Not maintaining rigid body; Hip flexor dominance; Too fast.",
                null);

        seed("Cable Crunch", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 15, 60,
                "Loaded ab crunch using cable machine for progressive overload.",
                "1. Kneel at cable, rope behind head.\n2. Crunch down, elbows toward knees.\n3. Hold contraction 1 second.\n4. Return with control.",
                "Using hip flexors; Not holding contraction; Too much weight.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Crunch.gif");

        seed("Hanging Knee Raise", Exercise.MuscleGroup.CORE, Exercise.Difficulty.INTERMEDIATE, Exercise.Equipment.GYM,
                3, 12, 60,
                "Hanging from a bar, raising knees to develop lower abs.",
                "1. Hang from pull-up bar.\n2. Raise knees to chest, controlling swing.\n3. Lower slowly.\n4. Avoid using momentum.",
                "Swinging wildly; Partial range; Not controlling descent.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Hanging-Knee-Raise.gif");

        // ══════════════════════════════════════════════════════════════════
        // PRENATAL SAFE EXERCISES — Low-impact, OB-approved movements
        // Marked as BEGINNER difficulty, HOME or NO_EQUIPMENT
        // These are used when goal = PRENATAL_SAFE
        // ══════════════════════════════════════════════════════════════════

        // CORE — Prenatal safe
        seed("Prenatal Pelvic Tilt", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 45,
                "Gentle pelvic tilt to relieve lower back pain and strengthen core safely during pregnancy.",
                "1. Lie on your back (early pregnancy) or stand/kneel (later trimesters).\n2. Gently flatten lower back by tightening abs and tilting pelvis forward.\n3. Hold for 3-5 seconds.\n4. Release slowly and repeat.\n5. Breathe steadily throughout — never hold your breath.",
                "Holding breath; Over-arching the back; Moving too quickly; Lying flat after 20 weeks (use incline instead).",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Pelvic-Tilt.gif");

        seed("Prenatal Cat-Cow Stretch", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 45,
                "Gentle spinal mobility exercise that relieves back tension during pregnancy.",
                "1. Begin on all fours, wrists under shoulders, knees under hips.\n2. Inhale: drop belly, lift chest and tailbone (cow).\n3. Exhale: round spine toward ceiling, tuck chin and tailbone (cat).\n4. Move slowly and mindfully with breath.\n5. Safe for all trimesters.",
                "Moving fast without breath coordination; Putting too much pressure on wrists; Overextending the spine.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Cat-Cow-Stretch.gif");

        seed("Kegel Exercise", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 30,
                "Pelvic floor strengthening essential during pregnancy to prepare for labor and reduce incontinence.",
                "1. Sit, stand, or lie comfortably.\n2. Identify pelvic floor muscles (the ones you use to stop urine flow).\n3. Squeeze and hold for 5-10 seconds.\n4. Release completely for 5-10 seconds.\n5. Repeat. Can be done anywhere, anytime.",
                "Holding breath; Engaging buttocks or thighs instead of pelvic floor; Forgetting to release fully.",
                null);

        seed("Prenatal Bird-Dog", Exercise.MuscleGroup.CORE, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 45,
                "Modified bird-dog for core stability without putting pressure on the belly.",
                "1. Start on all fours, neutral spine.\n2. Extend right arm forward and left leg back simultaneously.\n3. Hold for 3 seconds, keeping hips level.\n4. Return and switch sides.\n5. Keep core gently engaged — breathe normally.",
                "Twisting hips; Raising leg too high; Rushing; Holding breath.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Bird-Dog.gif");

        // LEGS — Prenatal safe
        seed("Prenatal Wall Squat", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 45,
                "Supported squat using a wall — strengthens legs and glutes safely during pregnancy.",
                "1. Stand with back against wall, feet hip-width, 2 feet from wall.\n2. Slide down until thighs are parallel (or as far as comfortable).\n3. Hold 3-5 seconds.\n4. Push through heels to stand.\n5. Use wall for balance and support.",
                "Knees caving in; Dropping too fast; Going too deep causing discomfort; Leaning forward off the wall.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Wall-Squat.gif");

        seed("Prenatal Standing Glute Kick", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Standing glute kickback — activates glutes without lying on the belly.",
                "1. Stand holding a chair or wall for balance.\n2. Keep slight bend in the standing knee.\n3. Kick one leg straight back, squeezing the glute at the top.\n4. Hold 1-2 seconds.\n5. Lower slowly and repeat. Switch sides.",
                "Arching the lower back; Swinging the leg; Using momentum instead of glute control.",
                null);

        seed("Prenatal Side-Lying Leg Lift", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 12, 45,
                "Side-lying hip abductor exercise — comfortable and safe at all stages.",
                "1. Lie on your side, head on arm or pillow.\n2. Keep body in a straight line.\n3. Lift top leg to hip height, toes slightly down.\n4. Hold briefly at top.\n5. Lower slowly. Switch sides.",
                "Rotating the hip; Raising the leg too high; Rocking the body; Using the belly to stabilize.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Side-Lying-Hip-Abduction.gif");

        seed("Prenatal Clamshell", Exercise.MuscleGroup.LEGS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Hip abduction exercise that strengthens the glutes and outer hips while lying on side.",
                "1. Lie on your side with hips stacked, knees bent at 45°.\n2. Keep feet together.\n3. Open top knee like a clamshell.\n4. Squeeze glute at the top.\n5. Lower slowly. Switch sides.",
                "Rolling the pelvis backward; Lifting too high; Rushing; Not engaging the glute.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Clamshell.gif");

        // BACK — Prenatal safe
        seed("Prenatal Seated Row (Band)", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 12, 45,
                "Gentle seated row with resistance band — safe posture-strengthening exercise during pregnancy.",
                "1. Sit upright on chair, band looped around feet.\n2. Hold band ends, arms extended.\n3. Pull elbows back, squeezing shoulder blades together.\n4. Hold 1 second.\n5. Return slowly. Keep posture tall throughout.",
                "Rounding the back; Jerking the band; Leaning back; Using momentum.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Resistance-Band-Row.gif");

        seed("Prenatal Superman (Modified)", Exercise.MuscleGroup.BACK, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 10, 45,
                "Gentle back extension on all fours — avoids lying face down.",
                "1. Start on all fours.\n2. Extend one arm forward while keeping hips square.\n3. Hold 3 seconds.\n4. Return and switch arms.\n5. Can also extend opposite arm and leg together.",
                "Twisting the hips; Hyperextending the neck; Moving too fast.",
                null);

        // SHOULDERS — Prenatal safe
        seed("Prenatal Seated Shoulder Press (Band)", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 12, 60,
                "Seated overhead press with light resistance band — safe shoulder strengthening.",
                "1. Sit on chair with good posture.\n2. Step on band, hold at shoulder height.\n3. Press band overhead until arms nearly straight.\n4. Lower slowly to start.\n5. Use light resistance — no strain.",
                "Using too much resistance; Arching lower back; Holding breath; Dropping the weight fast.",
                null);

        seed("Prenatal Lateral Raise (Light)", Exercise.MuscleGroup.SHOULDERS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 12, 45,
                "Gentle shoulder lateral raise with very light dumbbells (1-3 kg).",
                "1. Stand or sit with light dumbbells at sides.\n2. Raise arms to shoulder height on both sides.\n3. Hold 1 second.\n4. Lower slowly.\n5. Keep shoulders relaxed — no shrugging.",
                "Using too heavy a weight; Shrugging shoulders; Rushing; Locking elbows.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif");

        // CHEST — Prenatal safe
        seed("Prenatal Wall Push-Up", Exercise.MuscleGroup.CHEST, Exercise.Difficulty.BEGINNER, Exercise.Equipment.NO_EQUIPMENT,
                3, 15, 45,
                "Wall push-up — safe upper body exercise throughout pregnancy.",
                "1. Stand arm's length from wall.\n2. Place hands on wall at chest height, shoulder-width.\n3. Bend elbows, bring chest toward wall.\n4. Push back to start.\n5. Keep body straight — core gently engaged.",
                "Arching the back; Dropping the head forward; Feet too close to wall (too easy) or too far (too hard).",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Wall-Push-Up.gif");

        // BICEPS — Prenatal safe
        seed("Prenatal Seated Bicep Curl (Band)", Exercise.MuscleGroup.BICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 12, 45,
                "Seated bicep curl with light resistance band — comfortable during all trimesters.",
                "1. Sit on chair with good posture.\n2. Step on band, grip handles at sides.\n3. Curl up to shoulders.\n4. Squeeze at top.\n5. Lower slowly.",
                "Leaning forward; Using momentum; Elbows flaring; Going too heavy.",
                "https://www.fitnessprogramer.com/wp-content/uploads/2021/06/Resistance-Band-Bicep-Curl.gif");

        // TRICEPS — Prenatal safe
        seed("Prenatal Tricep Band Extension", Exercise.MuscleGroup.TRICEPS, Exercise.Difficulty.BEGINNER, Exercise.Equipment.HOME,
                3, 12, 45,
                "Seated overhead tricep extension with light band — safe for pregnancy.",
                "1. Sit upright, anchor band under the chair.\n2. Hold band overhead, elbows bent.\n3. Extend arms up, squeezing triceps.\n4. Lower slowly.\n5. Keep elbows pointing forward, not flaring.",
                "Elbows flaring out; Using too much resistance; Arching the back.",
                null);

        log.info("All exercises seeded successfully.");

    }
}
