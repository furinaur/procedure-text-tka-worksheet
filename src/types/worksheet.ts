import { DragStep } from '../data/procedureTestData';

export interface UserStageAnswers {
  sequenceOrder: string[]; // Step IDs in current user order
  mcSingleAnswers: Record<string, string>; // questionId -> optionId
  mcMultipleAnswers: Record<string, string[]>; // questionId -> optionIds
  categorizedAnswers: Record<string, Record<string, 'Sesuai' | 'Tidak Sesuai'>>; // questionId -> statementId -> choice
}

export interface QuestionScoreDetail {
  questionId: string;
  type: string;
  title: string;
  competency: string;
  score: number;
  maxScore: number;
  percentage: number;
  isCorrect: boolean;
  userAnswerSummary: string;
  correctAnswerSummary: string;
  explanation: string;
}

export interface StageScoreResult {
  stageId: number;
  tier: string;
  tierLabel: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionDetails: QuestionScoreDetail[];
}

export interface OverallTestResult {
  studentName: string;
  timestamp: string;
  totalScore: number; // 0 - 100
  timeSpentSeconds: number; // seconds used
  timeRemainingSeconds: number;
  stage1Result: StageScoreResult;
  stage2Result: StageScoreResult;
  adaptiveTierChosen: 'advanced_hots' | 'foundation_mastery';
  competencies: {
    structure_goal: number;
    temporal_sequence: number;
    imperative_language: number;
    inference_troubleshoot: number;
  };
  insights: {
    grade: string;
    headline: string;
    strengths: string[];
    weaknesses: string[];
    tutorRecommendations: string[];
  };
}
