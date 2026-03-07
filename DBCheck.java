import java.sql.*;

public class DBCheck {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/fit-ai";
        String user = "postgres";
        String password = "root";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("--- Exercise GIF Check ---");
            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(
                            "SELECT name, gif_url FROM exercises WHERE name IN ('Pushups', 'Incline Dumbbell Press', 'Cable Fly')")) {
                while (rs.next()) {
                    System.out.println("Exercise: " + rs.getString("name") + " | GIF: " + rs.getString("gif_url"));
                }
            }

            System.out.println("\n--- Latest Preference Check ---");
            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(
                            "SELECT p.id, p.level, p.goal, u.email FROM workout_preferences p JOIN users u ON p.user_id = u.id ORDER BY p.id DESC LIMIT 1")) {
                if (rs.next()) {
                    System.out.println("ID: " + rs.getLong("id") + " | Level: " + rs.getString("level") + " | Goal: "
                            + rs.getString("goal") + " | User: " + rs.getString("email"));
                }
            }

            System.out.println("\n--- Latest Plan Exercise Check ---");
            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(
                            "SELECT e.name, we.difficulty FROM workout_exercises we JOIN exercises e ON we.exercise_id = e.id ORDER BY we.id DESC LIMIT 5")) {
                while (rs.next()) {
                    System.out
                            .println("Ex: " + rs.getString("name") + " | WE_Difficulty: " + rs.getString("difficulty"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
