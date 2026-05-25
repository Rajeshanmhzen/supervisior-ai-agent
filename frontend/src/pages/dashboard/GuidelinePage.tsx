import React from "react";
import { FiBook, FiBookOpen, FiCheckCircle, FiCheckSquare, FiFileText, FiInfo, FiList } from "react-icons/fi";

const GuidelinePage = () => {
  return (
    <div className="space-y-6 w-full h-full">
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <FiBook className="text-primary" />
          Tribhuvan University BCA Project Guidelines
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Comprehensive formatting rules and syllabus structure for BCA Final Year Projects.
        </p>

        <div className="mt-8 space-y-8">
          {/* Document Structure section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FiInfo className="text-blue-500" /> General Formatting Rules
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 list-disc pl-5">
              <li><strong>Font Family:</strong> Times New Roman must be used throughout the report.</li>
              <li><strong>Font Sizes:</strong>
                <ul className="list-circle pl-5 mt-1 text-slate-500">
                  <li>Chapter Titles (Heading 1): 16pt, Bold, ALL CAPS</li>
                  <li>Main Headings (Heading 2): 14pt, Bold, Title Case</li>
                  <li>Sub-headings (Heading 3): 12pt, Bold, Title Case</li>
                  <li>Normal Body Text: 12pt, Regular</li>
                </ul>
              </li>
              <li><strong>Line Spacing:</strong> 1.5 line spacing for body text. Single spacing for tables and code snippets.</li>
              <li><strong>Margins:</strong> Left: 1.25", Right: 1", Top: 1", Bottom: 1".</li>
              <li><strong>Text Alignment:</strong> Justified.</li>
              <li><strong>Page Numbering:</strong> Bottom-center. Roman numerals (i, ii, iii) for preliminary pages. Arabic numerals (1, 2, 3) starting from Chapter 1.</li>
            </ul>
          </section>

          {/* Chapter Structure section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FiList className="text-green-500" /> Syllabus & Chapter Structure
            </h2>
            
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Preliminary Pages</h3>
                <p className="text-sm text-slate-600 mt-1">Cover Page, Title Page, Certificate of Approval, Recommendation, Acknowledgment, Abstract, Table of Contents, List of Figures, List of Tables, Abbreviations.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Chapter 1: Introduction</h3>
                <p className="text-sm text-slate-600 mt-1">Background, Problem Statement, Objectives, Scope and Limitation, Report Organization.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Chapter 2: Literature Review</h3>
                <p className="text-sm text-slate-600 mt-1">Review of existing systems, Literature/Theoretical framework.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Chapter 3: System Analysis and Design</h3>
                <p className="text-sm text-slate-600 mt-1">Methodology, Requirement Analysis (Functional/Non-functional), Feasibility Study, Use Case, Activity Diagram, Sequence Diagram, ER Diagram, Database Schema, UI Design.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Chapter 4: Implementation and Testing</h3>
                <p className="text-sm text-slate-600 mt-1">Tools used, Implementation Details, Testing Strategy (Unit, Integration, System testing), Test Cases.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Chapter 5: Conclusion and Future Recommendations</h3>
                <p className="text-sm text-slate-600 mt-1">Conclusion of the work done, Limitations, Future Enhancements.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">References & Appendices</h3>
                <p className="text-sm text-slate-600 mt-1">APA formatting for references. Appendices for code snippets, interview questions, or large tables.</p>
              </div>
            </div>
          </section>

          {/* Figures and Tables section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FiCheckSquare className="text-orange-500" /> Figures and Tables
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 list-disc pl-5">
              <li><strong>Captions:</strong> Every figure and table MUST have a numbered caption (e.g., "Figure 1.1: System Architecture" or "Table 3.2: Test Cases").</li>
              <li><strong>Caption Position:</strong> Table captions go ABOVE the table. Figure captions go BELOW the figure.</li>
              <li><strong>Alignment:</strong> Figures and Tables should be horizontally centered.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default GuidelinePage;
