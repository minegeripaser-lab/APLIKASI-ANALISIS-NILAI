import React, { useState, useEffect, useMemo } from 'react';
import {
  Assessment,
  LearningObjective,
  QuestionItem,
  SchoolProfile,
  Student,
  TeacherProfile,
} from './types';
import {
  defaultSchoolProfile,
  defaultTeacherProfile,
  loadActiveAssessmentId,
  loadAssessments,
  loadSchoolProfile,
  loadTeacherProfile,
  sampleAssessment,
  saveActiveAssessmentId,
  saveAssessments,
  saveSchoolProfile,
  saveTeacherProfile,
} from './utils/storage';
import {
  calculateClassStatistics,
  gradeStudents,
  analyzeItemPsychometrics,
  analyzeLearningObjectives,
} from './utils/psychometrics';
import { exportAssessmentToExcel } from './utils/excel';

import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { SchoolTeacherView } from './components/SchoolTeacherView';
import { StudentManager } from './components/StudentManager';
import { ObjectivesManager } from './components/ObjectivesManager';
import { QuestionsManager } from './components/QuestionsManager';
import { AnswersInputMatrix } from './components/AnswersInputMatrix';
import { ItemAnalysisView } from './components/ItemAnalysisView';
import { ObjectiveAnalysisView } from './components/ObjectiveAnalysisView';
import { RemedialView } from './components/RemedialView';
import { EnrichmentView } from './components/EnrichmentView';
import { ReportsPrintView } from './components/ReportsPrintView';
import { BackupResetView } from './components/BackupResetView';
import { FormulasGuideModal } from './components/FormulasGuideModal';
import { LoginModal } from './components/LoginModal';
import { AssessmentModal } from './components/AssessmentModal';

export default function App() {
  // Profiles
  const [school, setSchool] = useState<SchoolProfile>(loadSchoolProfile);
  const [teacher, setTeacher] = useState<TeacherProfile>(loadTeacherProfile);

  // Assessments
  const [assessments, setAssessments] = useState<Assessment[]>(loadAssessments);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>(loadActiveAssessmentId);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  // Modals
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Save changes to LocalStorage
  useEffect(() => {
    saveSchoolProfile(school);
  }, [school]);

  useEffect(() => {
    saveTeacherProfile(teacher);
  }, [teacher]);

  useEffect(() => {
    saveAssessments(assessments);
  }, [assessments]);

  useEffect(() => {
    saveActiveAssessmentId(activeAssessmentId);
  }, [activeAssessmentId]);

  // Active assessment reference
  const activeAssessment = useMemo(() => {
    const found = assessments.find((a) => a.id === activeAssessmentId);
    if (found) return found;
    return assessments[0] || sampleAssessment;
  }, [assessments, activeAssessmentId]);

  // Update active assessment helper
  const handleUpdateActiveAssessment = (updater: (prev: Assessment) => Assessment) => {
    setAssessments((prevList) =>
      prevList.map((a) => (a.id === activeAssessment.id ? updater(a) : a))
    );
  };

  // Pure Psychometric Calculations (Zero fake numbers, 100% computed from actual teacher inputs)
  const gradedResults = useMemo(() => {
    return gradeStudents(activeAssessment);
  }, [activeAssessment]);

  const classStats = useMemo(() => {
    return calculateClassStatistics(gradedResults, activeAssessment.kktp);
  }, [gradedResults, activeAssessment.kktp]);

  const itemAnalyses = useMemo(() => {
    return analyzeItemPsychometrics(activeAssessment, gradedResults);
  }, [activeAssessment, gradedResults]);

  const tpAnalyses = useMemo(() => {
    return analyzeLearningObjectives(activeAssessment, itemAnalyses, gradedResults);
  }, [activeAssessment, itemAnalyses, gradedResults]);

  // Excel Export Handler
  const handleExportExcel = () => {
    exportAssessmentToExcel(
      activeAssessment,
      gradedResults,
      classStats,
      itemAnalyses,
      tpAnalyses,
      school,
      teacher
    );
  };

  const handleQuickPrint = () => {
    setActiveTab('reports');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        school={school}
        teacher={teacher}
        assessments={assessments}
        activeAssessment={activeAssessment}
        onSelectAssessment={setActiveAssessmentId}
        onOpenNewAssessmentModal={() => setIsAssessmentModalOpen(true)}
        onOpenSchoolTeacherModal={() => setActiveTab('school_teacher')}
        onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
        onExportExcel={handleExportExcel}
        onQuickPrint={handleQuickPrint}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Navigation Sub-bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        remedialCount={classStats.failedCount}
        enrichmentCount={classStats.passedCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            assessment={activeAssessment}
            classStats={classStats}
            gradedResults={gradedResults}
            itemAnalyses={itemAnalyses}
            tpAnalyses={tpAnalyses}
            onNavigate={setActiveTab}
            onExportExcel={handleExportExcel}
            onQuickPrint={handleQuickPrint}
          />
        )}

        {activeTab === 'school_teacher' && (
          <SchoolTeacherView
            school={school}
            teacher={teacher}
            onSaveSchool={setSchool}
            onSaveTeacher={setTeacher}
          />
        )}

        {activeTab === 'students' && (
          <StudentManager
            students={activeAssessment.students}
            className={activeAssessment.className}
            assessment={activeAssessment}
            gradedResults={gradedResults}
            onUpdateStudents={(newStudents: Student[]) => {
              handleUpdateActiveAssessment((prev) => ({
                ...prev,
                students: newStudents,
              }));
            }}
            onUpdateStudentAnswers={(studentId, answers) => {
              handleUpdateActiveAssessment((prev) => {
                const currentRec = prev.studentAnswers[studentId] || { answers: {} };
                return {
                  ...prev,
                  studentAnswers: {
                    ...prev.studentAnswers,
                    [studentId]: {
                      ...currentRec,
                      answers,
                    },
                  },
                };
              });
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onPrintStudentReport={() => {
              setActiveTab('reports');
              setTimeout(() => {
                window.print();
              }, 300);
            }}
          />
        )}

        {activeTab === 'objectives' && (
          <ObjectivesManager
            objectives={activeAssessment.learningObjectives}
            questions={activeAssessment.questions}
            onUpdateObjectives={(newObjectives: LearningObjective[]) => {
              handleUpdateActiveAssessment((prev) => ({
                ...prev,
                learningObjectives: newObjectives,
              }));
            }}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsManager
            questions={activeAssessment.questions}
            objectives={activeAssessment.learningObjectives}
            onUpdateQuestions={(newQuestions: QuestionItem[]) => {
              handleUpdateActiveAssessment((prev) => ({
                ...prev,
                questions: newQuestions,
              }));
            }}
          />
        )}

        {activeTab === 'answers' && (
          <AnswersInputMatrix
            assessment={activeAssessment}
            onUpdateAnswers={(newAnswers) => {
              handleUpdateActiveAssessment((prev) => ({
                ...prev,
                studentAnswers: newAnswers,
              }));
            }}
          />
        )}

        {activeTab === 'item_analysis' && (
          <ItemAnalysisView
            itemAnalyses={itemAnalyses}
            onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
          />
        )}

        {activeTab === 'tp_analysis' && (
          <ObjectiveAnalysisView
            assessment={activeAssessment}
            tpAnalyses={tpAnalyses}
            onNavigateToRemedial={() => setActiveTab('remedial')}
          />
        )}

        {activeTab === 'remedial' && (
          <RemedialView
            assessment={activeAssessment}
            classStats={classStats}
            gradedResults={gradedResults}
            tpAnalyses={tpAnalyses}
            onUpdateAssessmentRemedialPolicy={(policy) => {
              handleUpdateActiveAssessment((prev) => ({
                ...prev,
                remedialPolicy: policy,
              }));
            }}
            onUpdateStudentRemedialRecord={(studentId, remedialScore, remedialDate, remedialNotes) => {
              handleUpdateActiveAssessment((prev) => {
                const currentRec = prev.studentAnswers[studentId] || { answers: {} };
                return {
                  ...prev,
                  studentAnswers: {
                    ...prev.studentAnswers,
                    [studentId]: {
                      ...currentRec,
                      remedialScore,
                      remedialDate,
                      remedialNotes,
                    },
                  },
                };
              });
            }}
            onQuickPrint={handleQuickPrint}
          />
        )}

        {activeTab === 'enrichment' && (
          <EnrichmentView
            assessment={activeAssessment}
            gradedResults={gradedResults}
            onUpdateEnrichmentActivity={(studentId, activity) => {
              handleUpdateActiveAssessment((prev) => {
                const currentRec = prev.studentAnswers[studentId] || { answers: {} };
                return {
                  ...prev,
                  studentAnswers: {
                    ...prev.studentAnswers,
                    [studentId]: {
                      ...currentRec,
                      enrichmentActivity: activity,
                    },
                  },
                };
              });
            }}
            onQuickPrint={handleQuickPrint}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPrintView
            assessment={activeAssessment}
            school={school}
            teacher={teacher}
            classStats={classStats}
            gradedResults={gradedResults}
            itemAnalyses={itemAnalyses}
            tpAnalyses={tpAnalyses}
            onExportExcel={handleExportExcel}
          />
        )}

        {activeTab === 'backup' && (
          <BackupResetView
            school={school}
            teacher={teacher}
            assessments={assessments}
            activeAssessment={activeAssessment}
            onRestoreAll={(newSchool, newTeacher, newAssessments) => {
              setSchool(newSchool);
              setTeacher(newTeacher);
              setAssessments(newAssessments);
              if (newAssessments.length > 0) {
                setActiveAssessmentId(newAssessments[0].id);
              }
            }}
            onReloadSampleData={() => {
              setAssessments([sampleAssessment]);
              setActiveAssessmentId(sampleAssessment.id);
            }}
            onDeleteCurrentAssessment={() => {
              const remaining = assessments.filter((a) => a.id !== activeAssessment.id);
              setAssessments(remaining);
              if (remaining.length > 0) {
                setActiveAssessmentId(remaining[0].id);
              }
            }}
          />
        )}
      </main>

      {/* Footer (No-print, quiet metadata) */}
      <footer className="no-print mt-auto py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AnalisGuru · Aplikasi Analisis Asesmen & Butir Soal Kurikulum Merdeka & K-13
          </span>
          <span className="text-[11px] text-slate-400">
            {school.schoolName} · KKTP: {activeAssessment.kktp}
          </span>
        </div>
      </footer>

      {/* Modals */}
      <FormulasGuideModal
        isOpen={isFormulasModalOpen}
        onClose={() => setIsFormulasModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        teacher={teacher}
        onUpdateTeacher={setTeacher}
      />

      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        defaultStudents={activeAssessment.students}
        onSaveAssessment={(newAssessment) => {
          setAssessments((prev) => [...prev, newAssessment]);
          setActiveAssessmentId(newAssessment.id);
        }}
      />
    </div>
  );
}
