const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  studentSignIn: async ({ email, password }) => {
    await sleep(400);
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    return {
      id: "student-user",
      role: "student",
      email
    };
  },

  studentSignUp: async ({ fullName, studentId, email, password }) => {
    await sleep(500);
    if (!fullName || !studentId || !email || !password) {
      throw new Error("Please complete all fields.");
    }

    return {
      created: true
    };
  },

  adminSignIn: async ({ email, password }) => {
    await sleep(450);
    if (!email || !password) {
      throw new Error("Admin email and password are required.");
    }

    return {
      id: "admin-user",
      role: "admin",
      email
    };
  },

  conductElection: async () => {
    await sleep(600);
    return {
      ok: true,
      message: "Election process started successfully."
    };
  }
};