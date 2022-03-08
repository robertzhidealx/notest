const QuestionList = ({ type, qs, ...props }) => {
  return (
    <div {...props}>
      <p className='mb-2'>{`${type} questions:`}</p>
      <div className='flex flex-col gap-2'>{qs.map((x) => x)}</div>
    </div>
  );
};

export default QuestionList;
