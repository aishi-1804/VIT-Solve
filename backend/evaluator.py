from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv

load_dotenv()

class EvaluationResult(BaseModel):
    relevance_score: float = Field(description="Score from 0.0 to 1.0")
    label: str = Field(description="One of: Highly Relevant, Relevant, Partially Relevant, Irrelevant")
    justification: str = Field(description="2-3 sentence explanation of the evaluation")

parser = JsonOutputParser(pydantic_object=EvaluationResult)

TEMPLATE = """
You are an academic answer evaluator for a university peer learning platform.
A student posted an academic doubt, and a peer submitted an answer.

Your task is to evaluate how semantically relevant the peer answer is to the question.

Question: {question}
Peer Answer: {answer}

Evaluate based on:
1. Conceptual alignment — does the answer address what was asked?
2. Factual accuracy — is the content academically correct?
3. Completeness — does it sufficiently resolve the doubt?
4. Pedagogical value — is it helpful for learning?

Respond ONLY with a valid JSON object in this exact format:
{{
  "relevance_score": <float between 0.0 and 1.0>,
  "label": "<one of: Highly Relevant, Relevant, Partially Relevant, Irrelevant>",
  "justification": "<2-3 sentence explanation>"
}}
"""

prompt = PromptTemplate(
    template=TEMPLATE,
    input_variables=["question", "answer"]
)

def evaluate_answer(question: str, answer: str) -> dict:
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    chain = prompt | llm | parser
    result = chain.invoke({"question": question, "answer": answer})
    return result
