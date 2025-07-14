import React from 'react'

const optionLabels = ['A','B','C','D']

const QuizQuestionCard = ({question,selectedChoiceId,onSelect}) => {
  return (
    <div className='bg-white rounded-xl shadow p-6'>
        <h2 className='text-xl font-semibold mb-6'>
            {question?.text}
        </h2>

        <div className='space-y-4'>
            {question?.choices?.map((choice,index)=>{
                const isSelected = selectedChoiceId === choice.id;

                return (
                    <label 
                       key={choice.id}
                       className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transiton-all ${
                         isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-50'
                       }`}
                       onClick={()=>onSelect(choice.id)}
                    >
                        <div className='w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold flex items-center justify-center mr-4'>
                            {optionLabels[index]}
                        </div>

                        <span className='text-gray-800 font-medium'>{choice.text}</span>
                    </label>
                )
            })}

        </div>
      
    </div>
  )
}

export default QuizQuestionCard
