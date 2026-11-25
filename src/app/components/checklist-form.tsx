'use client';
import Heading from '@/app/components/heading';
import { getErrorMessage, privateApi } from '@/app/libs/axios';
import useAuthStore from '@/app/libs/store/auth';
import Image from 'next/image';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ChecklistApiResponse, ChecklistQuestion } from '../libs/types';
import { useRouter } from 'next/navigation';





type TypeOfPageProps  = {
  formData: ChecklistApiResponse[];
  disabled?: boolean;
  traineeId: string;
  formType: string;
  traineeName: string;
}

type Answers = Record<string, string | string[]>;

type NormalizedQuestion = {
  id: string;
  questionText: string;
  details?: string;
  image?: string;
  controlType: 'yesno' | 'multiselect' | 'text' | 'singleselect' | 'rating';
  options: { id: string; text: string }[];
};

// Helper to normalize question
const normalizeQuestion = (q: ChecklistQuestion): NormalizedQuestion => {
  let controlType: NormalizedQuestion['controlType'] = 'text';
  if (q.answerType === 'boolean') controlType = 'yesno';
  else if (q.answerType === 'multipleCorrect') controlType = 'multiselect';
  else if (q.answerType === 'singleCorrect') controlType = 'singleselect';
  else if (q.answerType==="rating") controlType = "rating";

  return {
    id: String(q.id),
    questionText: q.text,
    details: q.description || undefined,
    image: q.imageUrl || undefined,
    controlType,
    options:
      q.options?.map((optVal) => ({
        id: optVal,
        text: optVal,
      })) || [],
  };
};


// Question UI
const QuestionBlock: React.FC<{
  q: NormalizedQuestion;
  value?: string | string[];
  onAnswer: (id: string, value: string | string[]) => void;
}> = ({ q, value, onAnswer }) => {


  const handleToggleYesNo = (value:string) => {
    onAnswer(q.id, value);
  };

  const handleSelectOption = (optId: string) => {
    if (q.controlType === 'multiselect') {
      const current = Array.isArray(value) ? [...value] : [];
      const updated = current.includes(optId)
        ? current.filter((v) => v !== optId)
        : [...current, optId];
      onAnswer(q.id, updated);
    } else {
      onAnswer(q.id, optId);
    }
  };
console.log("dfnlkdhg");
  return (
    <div className="border border-neutralBg rounded-primaryRadius p-3 my-3 bg-whiteBg shadow-custom">
      {q?.image && (
        <Image
          width={200}
          height={200}
          src={q.image}
          alt="question"
          className="w-40 mb-2 rounded-md object-contain"
        />
      )}

      <p className="font-medium text-info">{q.questionText}</p>
      {q.details && <p className="text-sm text-neutralText">{q.details}</p>}

      <div className="mt-2 space-y-2">
        {q?.controlType === 'yesno' ? (
          <>

<label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-info cursor-pointer"
              checked={value==="yes"}
              onChange={()=>handleToggleYesNo("yes")}
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-info cursor-pointer"
              checked={value==="no"}
              onChange={()=>handleToggleYesNo("no")}
            />
            <span>No</span>
          </label>


          </>
          
        ) : (q.controlType === 'multiselect'  || q.controlType==="singleselect") ? (
          q?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-info cursor-pointer"
                checked={q.controlType==="singleselect" ?  value===opt.id  : (Array.isArray(value) ? value.includes(opt.id) : false)}
                onChange={() => handleSelectOption(opt.id)}
              />
              <span>{opt.text}</span>
            </label>
          ))
        ) : 


                 q.controlType === "rating" ? (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onAnswer(q.id, String(star))}
        className={`text-2xl cursor-pointer transition-colors ${
           (value && Number(value) >= star)
            ? "text-primary"
            : "text-gray-300"
        }`}
      >
        ★
      </button>
    ))}
  </div>
)

:
        
        
        
        (
          <input
            type="text"
            className="w-full border border-neutralBg p-2 rounded-md"
            placeholder="Your answer"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onAnswer(q.id, e.target.value)}
          />
        )}
      </div>
    </div>
  );
};

// Main form
const ChecklistForm: React.FC<TypeOfPageProps> = ({ formData,disabled=false , traineeId, formType, traineeName}) => {
  const form = formData[0];
  const [answers, setAnswers] = useState<Answers>({});
  const { userAuthData } = useAuthStore();
  const router = useRouter();


  const handleAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };





const handleSubmit = async () => {

  const toastId = toast.loading("Submitting the form...");

  const startPayload = {
    trainingType: form?.trainingType,
    dayLabel: form?.dayLabel,
    filledBy: form?.filledBy,
    filledById:Number(userAuthData?.userId),
    traineeId: Number(traineeId),
  };



  try {

    const response = await privateApi.post(`${process.env.NEXT_PUBLIC_API_BASE_POINT}/training/${formType === "checklist" ? "checklists" : "evaluations"}-responses/start`, {
      ...startPayload
    });

    if(response?.status===200 || response?.status===201){

      const submissionId = response?.data?.id;



      const items = Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId: Number(questionId),
        answerValue: (answerValue==="no" ? false: answerValue==="yes" ? true : answerValue),
      }));
  
      const result = await privateApi.post(`/training/${formType === "checklist" ? "checklists" : "evaluations"}-responses/${submissionId}/responses`, {
        responses: items,
      });


      if (result.status === 200 || result.status === 201) {
        toast.success("Form submitted!", { id: toastId, duration: 3000 });
        

        setTimeout(() => {
          toast.dismiss(toastId);
          router.push("/trainee-evaluation");
        }, 1000);


      } else {
        toast.error("Something went wrong!", { id: toastId, duration: 3000 });
      }


    }else{

      toast.error("Something went wrong!", { id: toastId, duration: 3000 });

    }

    } catch (err) {
    toast.error(getErrorMessage(err), { id: toastId, duration: 3000 });
  }
};






  return (

    formData?.length > 0 
    ?

    <div>
      <Heading
        text={`${formType==="checklist" ? "Checklist" : "Evaluation"} – ${form?.trainingType}`}
      />

      <div className="space-y-8 mt-2">

        <p className='text-primary text-bodyLarge'>Trainee: {traineeName}</p>
        {(formType==="checklist" ? form?.ChecklistSection : form?.EvaluationSection)?.map((section) => (
          <div
            key={section?.id}
            className="bg-secondarySurface border border-neutralBg rounded-primaryRadius p-5 shadow-custom"
          >
            <h2 className="text-heading4 text-info font-medium mb-2">
              {section?.name}
            </h2>

            {/* Section-level questions */}
            {(formType==="checklist" ? section?.ChecklistQuestion : section?.EvaluationQuestion)?.map((rawQ) => {
              const nq = normalizeQuestion(rawQ);
              return (
                <QuestionBlock
                  key={nq.id}
                  q={nq}
                  value={answers[nq.id]}
                  onAnswer={handleAnswer}
                />
              );
            })}

            {/* Subsections inside section */}
            {(formType==="checklist" ? section.ChecklistSubSection : section?.EvaluationSubSection)?.map((sub) => (
              <div
                key={sub.id}
                className="mt-6 ml-4 border-l-4 border-info/30 pl-4"
              >
                <h3 className="text-heading4 text-info mb-3">{sub?.name}</h3>

                {(formType==="checklist" ? sub?.ChecklistQuestion : sub?.EvaluationQuestion)?.map((rawQ) => {
                  const nq = normalizeQuestion(rawQ);
                  return (
                    <QuestionBlock
                      key={nq.id}
                      q={nq}
                      value={answers[nq.id]}
                      onAnswer={handleAnswer}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        disabled={disabled}
        onClick={handleSubmit}
        className="bg-info text-white px-6 py-3 rounded-secondaryRadius mt-8 shadow-custom"
      >
        Submit
      </button>
    </div>

    :

    <div className='flex items-center justify-center'>
      <p className='text-error text-heading4'>No Form Found!</p>
    </div>
  );
};

export default ChecklistForm;
