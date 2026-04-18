from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from evaluator import evaluate_answer
from database import init_db, save_evaluation, get_evaluations_for_doubt
import uvicorn

app = FastAPI(title="LLM Semantic Evaluator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

init_db()

class EvalRequest(BaseModel):
    answer_id: str
    doubt_id: str
    question: str
    answer: str

class EvalResponse(BaseModel):
    answer_id: str
    relevance_score: float
    label: str
    justification: str

@app.post("/evaluate", response_model=EvalResponse)
async def evaluate(request: EvalRequest):
    if not request.question.strip() or not request.answer.strip():
        raise HTTPException(status_code=400, detail="Question and answer cannot be empty")
    
    result = evaluate_answer(request.question, request.answer)
    
    save_evaluation(
        request.answer_id,
        request.doubt_id,
        result["relevance_score"],
        result["label"],
        result["justification"]
    )
    
    return EvalResponse(
        answer_id=request.answer_id,
        relevance_score=result["relevance_score"],
        label=result["label"],
        justification=result["justification"]
    )

@app.get("/evaluations/{doubt_id}")
async def get_evaluations(doubt_id: str):
    return get_evaluations_for_doubt(doubt_id)

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
