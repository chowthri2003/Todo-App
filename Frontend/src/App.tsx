import { Routes, Route } from "react-router-dom";
import { ClerkLoaded } from "@clerk/clerk-react";
import ClerkProtectedRoute from "./auth/ClerkProtectedRoutes";
import Task from "./pages/TaskBoardPage";
import TaskTable from "./pages/TaskTablePage";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";

function App() {
  return (
    <ClerkLoaded>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="/"
          element={
            <ClerkProtectedRoute>
              <Task />
            </ClerkProtectedRoute>
          }
        />

        <Route
          path="/task"
          element={
            <ClerkProtectedRoute>
              <TaskTable />
            </ClerkProtectedRoute>
          }
        />
      </Routes>
    </ClerkLoaded>
  );
}

export default App;
