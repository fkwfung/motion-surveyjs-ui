import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingElement } from '../elements/types/RatingElement';
import { QuestionRatingModel, SurveyModel } from 'survey-core';
import { RenderOptions } from '../ui/types';

const mockOpts: RenderOptions = {
  animate: false,
  duration: 0,
  t: (key) => key,
  validationSeq: 0,
  questionIndex: 0,
  globalQuestionIndex: 0,
  showQuestionNumbers: 'off',
};

describe('RatingElement', () => {
  it('renders without crashing', () => {
    const question = new QuestionRatingModel('q1');
    render(<RatingElement question={question} opts={mockOpts} />);
    // SurveyJS default rating has 5 items (1-5)
    const items = screen.getAllByRole('button');
    expect(items).toHaveLength(5);
  });

  it('renders default 1-5 rating (T004)', () => {
    const question = new QuestionRatingModel('q1');
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('1');
    expect(items[4]).toHaveTextContent('5');
  });

  it('renders custom rate values (T006)', () => {
    const question = new QuestionRatingModel('q2');
    question.rateValues = [
      { value: 'A', text: 'Option A' },
      { value: 'B', text: 'Option B' },
      { value: 'C', text: 'Option C' }
    ];
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Option A');
    expect(items[1]).toHaveTextContent('Option B');
    expect(items[2]).toHaveTextContent('Option C');
  });

  it('updates value on click', () => {
    const question = new QuestionRatingModel('q3');
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    fireEvent.click(items[2]); // Click '3'
    
    expect(question.value).toBe(3);
  });

  it('renders numeric range min/max/step (T008)', () => {
    const question = new QuestionRatingModel('q4');
    question.rateMin = 0;
    question.rateMax = 10;
    question.rateStep = 2;
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    // 0, 2, 4, 6, 8, 10 -> 6 items
    expect(items).toHaveLength(6);
    expect(items[0]).toHaveTextContent('0');
    expect(items[5]).toHaveTextContent('10');
  });

  it('renders min/max descriptions (T011)', () => {
    const question = new QuestionRatingModel('q5');
    question.minRateDescription = 'Bad';
    question.maxRateDescription = 'Good';
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    expect(screen.getByText('Bad')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders descriptions as extreme items (T011)', () => {
    const question = new QuestionRatingModel('q6');
    question.minRateDescription = 'Bad';
    question.maxRateDescription = 'Good';
    question.displayRateDescriptionsAsExtremeItems = true;
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    expect(items[0]).toHaveTextContent('Bad');
    expect(items[4]).toHaveTextContent('Good');
  });

  it('renders stars mode (T015)', () => {
    const question = new QuestionRatingModel('q7');
    question.rateType = 'stars';
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    // Should render SVGs
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders smileys mode (T015)', () => {
    const question = new QuestionRatingModel('q8');
    question.rateType = 'smileys';
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    // Should render SVGs (Lucide icons)
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('applies scaleColorMode (T015)', () => {
    const survey = new SurveyModel({
      elements: [{ type: 'rating', name: 'q9', scaleColorMode: 'colored' }]
    });
    const question = survey.getQuestionByName('q9') as QuestionRatingModel;
    
    render(<RatingElement question={question} opts={mockOpts} />);
    
    const items = screen.getAllByRole('button');
    // Check if style attribute contains color or background-color
    // Note: The implementation might use inline styles or CSS variables.
    // We'll check if the button has the style attribute set.
    expect(items[0]).toHaveAttribute('style');
  });
});
