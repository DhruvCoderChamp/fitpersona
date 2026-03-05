package com.fitai.workout.service;

import com.fitai.workout.dto.DietPlanRequest;
import com.fitai.workout.dto.DietPlanResponse;
import com.fitai.workout.dto.DietPlanResponse.DietDayResponse;
import com.fitai.workout.dto.DietPlanResponse.MealResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DietPlanService {

    private static final String[] DAY_NAMES = {
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    };

    public DietPlanResponse generateDietPlan(DietPlanRequest request) {
        // 1. Calculate BMR using Mifflin-St Jeor
        double bmr = calculateBMR(request);

        // 2. Calculate TDEE
        double tdee = bmr * getActivityMultiplier(request.getActivityLevel());

        // 3. Adjust calories based on goal
        int dailyCalories = adjustCaloriesForGoal(tdee, request.getGoal());

        // 4. Calculate macro split
        int[] macros = calculateMacros(dailyCalories, request.getGoal());
        int protein = macros[0];
        int carbs = macros[1];
        int fats = macros[2];

        // 5. Generate 7-day meal plan
        List<DietDayResponse> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            days.add(generateDay(i + 1, DAY_NAMES[i], dailyCalories, request.getGoal(), i));
        }

        return DietPlanResponse.builder()
                .dailyCalories(dailyCalories)
                .proteinGrams(protein)
                .carbsGrams(carbs)
                .fatsGrams(fats)
                .goal(formatGoal(request.getGoal()))
                .days(days)
                .build();
    }

    private double calculateBMR(DietPlanRequest req) {
        // Mifflin-St Jeor Equation
        if ("male".equalsIgnoreCase(req.getGender())) {
            return (10 * req.getWeight()) + (6.25 * req.getHeight()) - (5 * req.getAge()) + 5;
        } else {
            return (10 * req.getWeight()) + (6.25 * req.getHeight()) - (5 * req.getAge()) - 161;
        }
    }

    private double getActivityMultiplier(DietPlanRequest.ActivityLevel level) {
        return switch (level) {
            case SEDENTARY -> 1.2;
            case MODERATE -> 1.55;
            case ACTIVE -> 1.725;
        };
    }

    private int adjustCaloriesForGoal(double tdee, DietPlanRequest.DietGoal goal) {
        return switch (goal) {
            case FAT_LOSS -> (int) (tdee - 500);
            case WEIGHT_GAIN -> (int) (tdee + 400);
            case MUSCLE_GAIN -> (int) (tdee + 300);
            case MAINTENANCE -> (int) tdee;
        };
    }

    private int[] calculateMacros(int calories, DietPlanRequest.DietGoal goal) {
        double proteinRatio, carbsRatio, fatsRatio;

        switch (goal) {
            case FAT_LOSS -> {
                proteinRatio = 0.40;
                carbsRatio = 0.30;
                fatsRatio = 0.30;
            }
            case MUSCLE_GAIN -> {
                proteinRatio = 0.35;
                carbsRatio = 0.40;
                fatsRatio = 0.25;
            }
            case WEIGHT_GAIN -> {
                proteinRatio = 0.25;
                carbsRatio = 0.50;
                fatsRatio = 0.25;
            }
            default -> { // MAINTENANCE
                proteinRatio = 0.30;
                carbsRatio = 0.40;
                fatsRatio = 0.30;
            }
        }

        int protein = (int) ((calories * proteinRatio) / 4); // 4 cal per gram
        int carbs = (int) ((calories * carbsRatio) / 4); // 4 cal per gram
        int fats = (int) ((calories * fatsRatio) / 9); // 9 cal per gram

        return new int[] { protein, carbs, fats };
    }

    private DietDayResponse generateDay(int dayNumber, String dayName, int dailyCalories,
            DietPlanRequest.DietGoal goal, int dayIndex) {
        // Distribute calories: Breakfast 25%, Lunch 35%, Snack 10%, Dinner 30%
        int breakfastCal = (int) (dailyCalories * 0.25);
        int lunchCal = (int) (dailyCalories * 0.35);
        int snackCal = (int) (dailyCalories * 0.10);
        int dinnerCal = (int) (dailyCalories * 0.30);

        List<MealResponse> meals = List.of(
                buildMeal("Breakfast", breakfastCal, getBreakfastOptions(goal, dayIndex)),
                buildMeal("Lunch", lunchCal, getLunchOptions(goal, dayIndex)),
                buildMeal("Snack", snackCal, getSnackOptions(goal, dayIndex)),
                buildMeal("Dinner", dinnerCal, getDinnerOptions(goal, dayIndex)));

        return DietDayResponse.builder()
                .dayNumber(dayNumber)
                .dayName(dayName)
                .meals(meals)
                .build();
    }

    private MealResponse buildMeal(String mealType, int calories, String[][] options) {
        return MealResponse.builder()
                .mealType(mealType)
                .description(options[0][0])
                .calories(calories)
                .items(List.of(options[0]))
                .build();
    }

    // ---- CURATED MEAL DATABASE ----

    private String[][] getBreakfastOptions(DietPlanRequest.DietGoal goal, int dayIndex) {
        String[][][] pool = switch (goal) {
            case FAT_LOSS -> new String[][][] {
                    { { "Oats with almond milk and berries", "Rolled oats (40g)", "Almond milk (200ml)",
                            "Mixed berries (80g)", "Chia seeds (10g)" } },
                    { { "Egg white omelette with spinach", "Egg whites (4)", "Spinach (50g)", "Cherry tomatoes (30g)",
                            "Whole wheat toast (1 slice)" } },
                    { { "Greek yogurt parfait", "Low-fat Greek yogurt (200g)", "Granola (25g)",
                            "Sliced strawberries (50g)", "Honey (5ml)" } },
                    { { "Smoothie bowl", "Banana (½)", "Spinach (30g)", "Protein powder (1 scoop)",
                            "Almond milk (150ml)", "Flax seeds (10g)" } },
                    { { "Avocado toast with egg", "Whole wheat bread (1 slice)", "Avocado (¼)", "Poached egg (1)",
                            "Cherry tomatoes (30g)" } },
                    { { "Cottage cheese with fruits", "Low-fat cottage cheese (150g)", "Pineapple chunks (60g)",
                            "Walnuts (10g)" } },
                    { { "Veggie scramble", "Whole eggs (2)", "Bell peppers (30g)", "Onions (20g)", "Mushrooms (30g)",
                            "Whole wheat toast (1 slice)" } }
            };
            case MUSCLE_GAIN -> new String[][][] {
                    { { "Protein pancakes with banana", "Oat flour (60g)", "Whey protein (1 scoop)", "Banana (1)",
                            "Eggs (2)", "Peanut butter (15g)" } },
                    { { "Eggs, toast and avocado", "Whole eggs (3)", "Whole wheat toast (2 slices)", "Avocado (½)",
                            "Orange juice (200ml)" } },
                    { { "Overnight oats with protein", "Rolled oats (60g)", "Milk (250ml)", "Protein powder (1 scoop)",
                            "Almonds (20g)", "Banana (1)" } },
                    { { "French toast with berries", "Whole wheat bread (2 slices)", "Eggs (2)", "Milk (100ml)",
                            "Mixed berries (80g)", "Honey (15ml)" } },
                    { { "Breakfast burrito", "Whole wheat tortilla (1)", "Scrambled eggs (3)", "Black beans (50g)",
                            "Cheese (30g)", "Salsa (30ml)" } },
                    { { "Smoothie with oats", "Banana (1)", "Oats (40g)", "Peanut butter (20g)", "Milk (300ml)",
                            "Protein powder (1 scoop)" } },
                    { { "Bagel with cream cheese and smoked salmon", "Whole wheat bagel (1)", "Cream cheese (20g)",
                            "Smoked salmon (50g)", "Capers (10g)" } }
            };
            case WEIGHT_GAIN -> new String[][][] {
                    { { "Loaded oatmeal", "Rolled oats (80g)", "Whole milk (300ml)", "Banana (1)",
                            "Peanut butter (25g)", "Honey (15ml)", "Almonds (20g)" } },
                    { { "Eggs and cheese toast", "Whole eggs (3)", "Cheese slices (2)", "Whole wheat toast (2 slices)",
                            "Butter (10g)", "Fruit juice (200ml)" } },
                    { { "Protein smoothie bowl", "Banana (1)", "Mango (80g)", "Protein powder (1 scoop)",
                            "Granola (40g)", "Milk (250ml)", "Coconut flakes (15g)" } },
                    { { "Pancakes with maple syrup", "Pancake mix (100g)", "Eggs (2)", "Milk (150ml)",
                            "Maple syrup (30ml)", "Butter (10g)", "Blueberries (50g)" } },
                    { { "PB&J French toast", "Whole wheat bread (2 slices)", "Eggs (2)", "Peanut butter (20g)",
                            "Jam (15g)", "Milk (100ml)" } },
                    { { "Breakfast wrap", "Flour tortilla (1 large)", "Scrambled eggs (3)", "Cheese (40g)", "Ham (30g)",
                            "Avocado (½)" } },
                    { { "Cereal bowl deluxe", "Muesli (80g)", "Whole milk (300ml)", "Banana (1)", "Mixed nuts (25g)",
                            "Raisins (15g)" } }
            };
            default -> new String[][][] { // MAINTENANCE
                    { { "Oatmeal with fruits and nuts", "Rolled oats (50g)", "Milk (200ml)", "Banana (½)",
                            "Almonds (15g)", "Honey (10ml)" } },
                    { { "Eggs and whole wheat toast", "Whole eggs (2)", "Whole wheat toast (2 slices)", "Butter (5g)",
                            "Orange (1)" } },
                    { { "Yogurt bowl", "Greek yogurt (150g)", "Granola (30g)", "Mixed berries (60g)",
                            "Honey (10ml)" } },
                    { { "Smoothie", "Banana (1)", "Spinach (30g)", "Protein powder (½ scoop)", "Milk (200ml)",
                            "Peanut butter (10g)" } },
                    { { "Avocado toast", "Whole wheat bread (2 slices)", "Avocado (½)", "Poached eggs (2)",
                            "Salt and pepper" } },
                    { { "Cereal with milk", "Whole grain cereal (50g)", "Milk (250ml)", "Banana (½)",
                            "Almonds (10g)" } },
                    { { "Veggie omelette", "Whole eggs (2)", "Egg white (1)", "Mixed vegetables (60g)", "Cheese (20g)",
                            "Whole wheat toast (1 slice)" } }
            };
        };
        return pool[dayIndex % pool.length];
    }

    private String[][] getLunchOptions(DietPlanRequest.DietGoal goal, int dayIndex) {
        String[][][] pool = switch (goal) {
            case FAT_LOSS -> new String[][][] {
                    { { "Grilled chicken salad", "Grilled chicken breast (150g)", "Mixed greens (100g)",
                            "Cherry tomatoes (50g)", "Cucumber (50g)", "Olive oil dressing (10ml)" } },
                    { { "Turkey and quinoa bowl", "Ground turkey (120g)", "Quinoa (60g cooked)",
                            "Steamed broccoli (80g)", "Bell peppers (40g)" } },
                    { { "Fish tacos with slaw", "Grilled fish fillet (130g)", "Corn tortillas (2 small)",
                            "Cabbage slaw (60g)", "Lime (½)", "Avocado (¼)" } },
                    { { "Lentil soup with bread", "Red lentils (80g dry)", "Carrots (40g)", "Celery (30g)",
                            "Whole wheat bread (1 slice)", "Lemon juice (15ml)" } },
                    { { "Chicken stir fry", "Chicken breast (140g)", "Mixed vegetables (100g)", "Soy sauce (10ml)",
                            "Brown rice (50g cooked)" } },
                    { { "Tuna salad wrap", "Tuna in water (1 can)", "Greek yogurt (30g)", "Lettuce (40g)",
                            "Whole wheat wrap (1)", "Celery (20g)" } },
                    { { "Grilled fish with veggies", "Grilled salmon (130g)", "Asparagus (80g)", "Sweet potato (80g)",
                            "Lemon (½)" } }
            };
            case MUSCLE_GAIN -> new String[][][] {
                    { { "Chicken breast with rice and veggies", "Chicken breast (200g)", "Brown rice (100g cooked)",
                            "Steamed broccoli (80g)", "Olive oil (10ml)" } },
                    { { "Beef and sweet potato bowl", "Lean ground beef (180g)", "Sweet potato (150g)",
                            "Green beans (80g)", "Olive oil (10ml)" } },
                    { { "Salmon with quinoa", "Salmon fillet (180g)", "Quinoa (80g cooked)",
                            "Roasted vegetables (100g)", "Lemon butter sauce (15ml)" } },
                    { { "Turkey meatball pasta", "Turkey meatballs (180g)", "Whole wheat pasta (80g dry)",
                            "Marinara sauce (100ml)", "Parmesan (15g)" } },
                    { { "Chicken burrito bowl", "Chicken thigh (180g)", "Brown rice (100g cooked)", "Black beans (60g)",
                            "Corn (40g)", "Salsa (40ml)", "Cheese (20g)" } },
                    { { "Steak with mashed potatoes", "Sirloin steak (170g)", "Mashed potatoes (150g)",
                            "Steamed broccoli (80g)", "Garlic butter (10g)" } },
                    { { "Tuna pasta bake", "Tuna (150g)", "Whole wheat pasta (80g dry)", "Cream sauce (60ml)",
                            "Cheese (30g)", "Mixed vegetables (60g)" } }
            };
            case WEIGHT_GAIN -> new String[][][] {
                    { { "Chicken biryani", "Chicken thigh (200g)", "Basmati rice (120g dry)", "Yogurt raita (50g)",
                            "Mixed spices", "Ghee (10g)" } },
                    { { "Double cheeseburger bowl", "Lean ground beef (200g)", "Rice (100g cooked)", "Cheese (40g)",
                            "Lettuce (30g)", "Tomato (30g)", "Special sauce (20ml)" } },
                    { { "Pasta with meat sauce", "Whole wheat pasta (100g dry)", "Ground beef (150g)",
                            "Marinara sauce (120ml)", "Parmesan (20g)", "Garlic bread (1 slice)" } },
                    { { "Chicken and rice plate", "Chicken thigh (200g)", "White rice (120g cooked)",
                            "Refried beans (60g)", "Corn (50g)", "Sour cream (20g)" } },
                    { { "Fish and chips", "Baked fish (180g)", "Sweet potato fries (150g)", "Coleslaw (60g)",
                            "Tartar sauce (15ml)" } },
                    { { "Lamb kebab plate", "Lamb kebab (180g)", "Pita bread (2)", "Hummus (50g)",
                            "Cucumber yogurt salad (60g)", "Rice (80g cooked)" } },
                    { { "Butter chicken with naan", "Butter chicken (200g)", "Naan bread (1)",
                            "Basmati rice (100g cooked)", "Raita (40g)" } }
            };
            default -> new String[][][] { // MAINTENANCE
                    { { "Grilled chicken with rice", "Chicken breast (150g)", "Brown rice (80g cooked)",
                            "Mixed vegetables (80g)", "Olive oil (10ml)" } },
                    { { "Fish with sweet potato", "Baked white fish (150g)", "Sweet potato (120g)",
                            "Steamed greens (80g)", "Lemon (½)" } },
                    { { "Chicken Caesar salad", "Grilled chicken (140g)", "Romaine lettuce (80g)",
                            "Caesar dressing (20ml)", "Croutons (20g)", "Parmesan (10g)" } },
                    { { "Bean and rice bowl", "Mixed beans (100g)", "Brown rice (80g cooked)", "Avocado (¼)",
                            "Salsa (30ml)", "Cheese (20g)" } },
                    { { "Turkey sandwich", "Turkey breast (100g)", "Whole wheat bread (2 slices)", "Lettuce (20g)",
                            "Tomato (30g)", "Mustard (10ml)", "Apple (1)" } },
                    { { "Pasta primavera", "Whole wheat pasta (70g dry)", "Mixed vegetables (100g)", "Olive oil (10ml)",
                            "Parmesan (15g)", "Garlic (5g)" } },
                    { { "Shrimp stir fry", "Shrimp (150g)", "Brown rice (80g cooked)", "Mixed vegetables (100g)",
                            "Soy sauce (10ml)", "Sesame oil (5ml)" } }
            };
        };
        return pool[dayIndex % pool.length];
    }

    private String[][] getSnackOptions(DietPlanRequest.DietGoal goal, int dayIndex) {
        String[][][] pool = switch (goal) {
            case FAT_LOSS -> new String[][][] {
                    { { "Apple with almond butter", "Apple (1 medium)", "Almond butter (10g)" } },
                    { { "Carrot sticks with hummus", "Carrots (100g)", "Hummus (30g)" } },
                    { { "Protein shake", "Whey protein (1 scoop)", "Water (250ml)", "Ice" } },
                    { { "Boiled eggs", "Boiled eggs (2)", "Salt and pepper" } },
                    { { "Mixed berries", "Strawberries (50g)", "Blueberries (50g)", "Raspberries (30g)" } },
                    { { "Rice cakes with cottage cheese", "Rice cakes (2)", "Cottage cheese (50g)" } },
                    { { "Cucumber and yogurt dip", "Cucumber (100g)", "Greek yogurt (50g)", "Mint" } }
            };
            case MUSCLE_GAIN -> new String[][][] {
                    { { "Trail mix with protein bar", "Trail mix (40g)", "Protein bar (1)" } },
                    { { "Peanut butter banana shake", "Banana (1)", "Peanut butter (20g)", "Milk (200ml)",
                            "Protein powder (½ scoop)" } },
                    { { "Greek yogurt with nuts", "Greek yogurt (150g)", "Mixed nuts (25g)", "Honey (10ml)" } },
                    { { "Cheese and crackers", "Cheddar cheese (40g)", "Whole wheat crackers (6)", "Grapes (50g)" } },
                    { { "Protein smoothie", "Protein powder (1 scoop)", "Banana (1)", "Oats (20g)", "Milk (200ml)" } },
                    { { "Hard boiled eggs with toast", "Boiled eggs (2)", "Whole wheat toast (1 slice)",
                            "Butter (5g)" } },
                    { { "Cottage cheese with pineapple", "Cottage cheese (150g)", "Pineapple chunks (80g)",
                            "Almonds (15g)" } }
            };
            case WEIGHT_GAIN -> new String[][][] {
                    { { "Peanut butter toast with banana", "Whole wheat toast (2 slices)", "Peanut butter (30g)",
                            "Banana (1)" } },
                    { { "Mass gainer shake", "Mass gainer (1 scoop)", "Whole milk (300ml)", "Banana (1)",
                            "Oats (30g)" } },
                    { { "Nuts and dried fruits", "Mixed nuts (40g)", "Dried cranberries (20g)",
                            "Dark chocolate chips (15g)" } },
                    { { "Granola bar with milk", "Granola bar (2)", "Whole milk (250ml)" } },
                    { { "Avocado toast", "Whole wheat toast (2 slices)", "Avocado (½)", "Olive oil drizzle",
                            "Seeds (10g)" } },
                    { { "Cheese and fruit plate", "Cheese cubes (50g)", "Grapes (60g)", "Crackers (4)",
                            "Almonds (15g)" } },
                    { { "Yogurt parfait", "Full-fat yogurt (200g)", "Granola (40g)", "Honey (15ml)",
                            "Mixed berries (50g)" } }
            };
            default -> new String[][][] { // MAINTENANCE
                    { { "Apple with peanut butter", "Apple (1)", "Peanut butter (15g)" } },
                    { { "Mixed nuts", "Almonds (15g)", "Walnuts (10g)", "Cashews (10g)" } },
                    { { "Yogurt with granola", "Greek yogurt (100g)", "Granola (20g)", "Honey (5ml)" } },
                    { { "Fruit salad", "Mixed seasonal fruits (150g)" } },
                    { { "Protein bar", "Protein bar (1)" } },
                    { { "Boiled egg and fruit", "Boiled egg (1)", "Banana (½)" } },
                    { { "Hummus and veggies", "Hummus (40g)", "Celery sticks (50g)", "Carrot sticks (50g)" } }
            };
        };
        return pool[dayIndex % pool.length];
    }

    private String[][] getDinnerOptions(DietPlanRequest.DietGoal goal, int dayIndex) {
        String[][][] pool = switch (goal) {
            case FAT_LOSS -> new String[][][] {
                    { { "Grilled salmon with asparagus", "Salmon fillet (150g)", "Asparagus (100g)", "Lemon (½)",
                            "Olive oil (5ml)" } },
                    { { "Chicken soup with vegetables", "Chicken breast (120g)", "Mixed vegetables (100g)",
                            "Low-sodium broth (300ml)", "Whole wheat crackers (3)" } },
                    { { "Baked cod with salad", "Cod fillet (150g)", "Mixed greens (80g)", "Cherry tomatoes (40g)",
                            "Balsamic dressing (10ml)" } },
                    { { "Turkey lettuce wraps", "Ground turkey (130g)", "Lettuce leaves (4 large)",
                            "Water chestnuts (30g)", "Soy sauce (10ml)", "Ginger (5g)" } },
                    { { "Shrimp and zucchini noodles", "Shrimp (150g)", "Zucchini noodles (150g)", "Garlic (5g)",
                            "Olive oil (10ml)", "Cherry tomatoes (40g)" } },
                    { { "Chicken and vegetable stew", "Chicken breast (140g)", "Carrots (50g)", "Celery (30g)",
                            "Potatoes (50g)", "Low-sodium broth (250ml)" } },
                    { { "Grilled tofu with vegetables", "Firm tofu (150g)", "Broccoli (80g)", "Bell peppers (50g)",
                            "Soy sauce (10ml)", "Brown rice (40g cooked)" } }
            };
            case MUSCLE_GAIN -> new String[][][] {
                    { { "Steak with baked potato", "Sirloin steak (200g)", "Baked potato (180g)",
                            "Steamed broccoli (80g)", "Sour cream (20g)" } },
                    { { "Chicken thigh with rice", "Chicken thighs (200g)", "Jasmine rice (100g cooked)",
                            "Grilled vegetables (100g)", "Teriyaki sauce (15ml)" } },
                    { { "Salmon with pasta", "Salmon fillet (180g)", "Whole wheat pasta (80g dry)",
                            "Cream sauce (40ml)", "Spinach (50g)", "Parmesan (15g)" } },
                    { { "Pork chops with sweet potato", "Pork chops (180g)", "Sweet potato mash (150g)",
                            "Green beans (80g)", "Apple sauce (30g)" } },
                    { { "Beef stir fry with noodles", "Beef strips (180g)", "Egg noodles (80g dry)",
                            "Mixed vegetables (100g)", "Oyster sauce (15ml)" } },
                    { { "Grilled lamb with couscous", "Lamb loin (170g)", "Couscous (80g dry)",
                            "Roasted vegetables (100g)", "Tzatziki (30g)" } },
                    { { "Chicken parmesan", "Chicken breast (200g)", "Marinara sauce (80ml)", "Mozzarella (40g)",
                            "Whole wheat spaghetti (70g dry)", "Side salad (60g)" } }
            };
            case WEIGHT_GAIN -> new String[][][] {
                    { { "Beef stew with bread", "Beef chunks (200g)", "Potatoes (150g)", "Carrots (60g)",
                            "Crusty bread (2 slices)", "Butter (10g)" } },
                    { { "Chicken alfredo pasta", "Chicken breast (180g)", "Fettuccine (100g dry)",
                            "Alfredo sauce (80ml)", "Parmesan (20g)", "Garlic bread (1 slice)" } },
                    { { "BBQ ribs with cornbread", "BBQ ribs (200g)", "Cornbread (1 piece)", "Baked beans (80g)",
                            "Coleslaw (60g)" } },
                    { { "Salmon teriyaki with rice", "Salmon (180g)", "White rice (120g cooked)",
                            "Teriyaki sauce (20ml)", "Edamame (60g)", "Miso soup (200ml)" } },
                    { { "Lamb curry with rice", "Lamb curry (200g)", "Basmati rice (120g cooked)", "Naan bread (1)",
                            "Mango chutney (15g)" } },
                    { { "Pizza night", "Whole wheat pizza (2 large slices)", "Side salad (60g)",
                            "Olive oil dressing (10ml)", "Fruit juice (200ml)" } },
                    { { "Grilled chicken with loaded potatoes", "Chicken thigh (200g)", "Baked potato (200g)",
                            "Cheese (30g)", "Sour cream (20g)", "Bacon bits (15g)", "Chives (5g)" } }
            };
            default -> new String[][][] { // MAINTENANCE
                    { { "Baked chicken with sweet potato", "Chicken breast (150g)", "Sweet potato (120g)",
                            "Steamed broccoli (80g)", "Olive oil (10ml)" } },
                    { { "Pasta with meat sauce", "Whole wheat pasta (70g dry)", "Lean ground beef (100g)",
                            "Marinara sauce (80ml)", "Parmesan (10g)" } },
                    { { "Grilled fish with rice", "White fish (150g)", "Brown rice (80g cooked)",
                            "Steamed vegetables (80g)", "Lemon (½)" } },
                    { { "Chicken stir fry", "Chicken breast (140g)", "Mixed vegetables (100g)",
                            "Brown rice (80g cooked)", "Soy sauce (10ml)" } },
                    { { "Beef tacos", "Lean ground beef (120g)", "Corn tortillas (3)", "Lettuce (30g)", "Cheese (20g)",
                            "Salsa (30ml)" } },
                    { { "Baked salmon", "Salmon fillet (150g)", "Quinoa (60g cooked)", "Roasted asparagus (80g)",
                            "Lemon butter (10ml)" } },
                    { { "Soup and sandwich", "Chicken soup (300ml)", "Whole wheat BLT sandwich", "Side salad (40g)" } }
            };
        };
        return pool[dayIndex % pool.length];
    }

    private String formatGoal(DietPlanRequest.DietGoal goal) {
        return switch (goal) {
            case FAT_LOSS -> "Fat Loss";
            case WEIGHT_GAIN -> "Weight Gain";
            case MUSCLE_GAIN -> "Muscle Gain";
            case MAINTENANCE -> "Maintenance";
        };
    }
}
