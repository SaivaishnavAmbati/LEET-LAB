import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  //going to get all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //going to check the user role once again

  // if (req.user.role !== "ADMIN") {
  //   return res.status(403).json({ error: "You are not allowed to create a problem" });
  // }
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not allowed to create a problem" });
  }
  if (!referenceSolutions || typeof referenceSolutions !== "object") {
    return res.status(400).json({
      error: "Invalid or missing referenceSolutions. Expected an object with language keys and solution strings.",
    });
  }
  

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("results--------", result);
        // console.log(
        //   `Testcases ${i + 1} and Language ${language} ---- result ${JSON.stringify(
        //     result.status.description
        //   )}`
        // );
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ error: `Testcase ${i + 1} failed for language ${language}`,
             });
        }
      }
    }
    // save the problem to the database;

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Message Created successfully",
      problem: newProblem,
    });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({
  //     error: "Erro While Creating Problem",
  //   });
  }
  catch (error) {
    console.error("❌ Error while creating problem:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      error: "Erro While Creating Problem",
      message: error.message,
    });
  }
};
export const getAllProblems = async (req, res) => {
  try {
    const problems=await db.problem.findMany();

    if(!problems){
      return res.status(404).json({
        error:"No Problem found"
      })
    }
    res.status(200).json({
      success:true,
      message:"Message Fetched Successfully",
      problems
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Successfully"
    })
  }

};

export const getProblemById = async (req, res) => {
const {id} = req.params;
try {
  const problem = await db.problem.findUnique({
    where:{
      id
    }
  }
)
if(!problem){
  return res.status(404).json({error:"Problem Not Found"})
}
return res.status(200).json({
  success:true,
  message:"message Created Successfully",
  problem
});
} 

catch (error) {
  console.log(error);
    return res.status(500).json({
      error: "Error While Fetching problem by id"
    })
}

};

export const updateproblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {
const {id}= req.params;
try {
  const problem = await db.problem.findUnique({ where: {id} });
  if(!problem){
    return res.status(404).json({error : "problem not Found"});
  }
  await db.problem.delete({ where: {id}});
  res.status(200).json({
    success:true,
    message:"Problem Deleted Successfully",
  });
} catch (error) {
  console.log(error)
  return res.status(500).json({
    error:"Error while deleting the problem"
  });
}

};

export const getAllProblemsSolvedByUser = async (req, res) => {};
