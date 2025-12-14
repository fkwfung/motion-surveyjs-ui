import { Question, type IElement } from 'survey-core'
import type { RenderOptions } from '../ui/types'
import { TextElement } from './TextElement'
import { CommentElement } from './CommentElement'
import { BooleanElement } from './BooleanElement'
import { ChoiceElement } from './ChoiceElement'
import { DropdownElement } from './DropdownElement'
import { HtmlElement } from './types/HtmlElement'
import { ImageElement } from './types/ImageElement'
import { ExpressionElement } from './types/ExpressionElement'
import { EmptyElement } from './types/EmptyElement'
import { RatingElement } from './types/RatingElement'
import { MultipleTextElement } from './types/MultipleTextElement'
import { ImagePickerElement } from './types/ImagePickerElement'
import { ButtonGroupElement } from './types/ButtonGroupElement'
import { TagboxElement } from './types/TagboxElement'
import { RankingElement } from './types/RankingElement'
import { FileElement } from './types/FileElement'
import { SignaturePadElement } from './types/SignaturePadElement'
import { PanelDynamicElement } from './types/PanelDynamicElement'
import { MatrixElement } from './types/MatrixElement'
import { MatrixDropdownElement } from './types/MatrixDropdownElement'
import { MatrixDynamicElement } from './types/MatrixDynamicElement'
import { FlowPanelElement } from './types/FlowPanelElement'

export function renderElement(element: IElement, opts: RenderOptions) {
  const type = typeof (element as unknown as { getType?: () => string }).getType === 'function'
    ? (element as unknown as { getType: () => string }).getType()
    : 'unknown'

  // Panels / containers
  if (!(element instanceof Question)) {
    switch (type) {
      case 'flowpanel':
        return <FlowPanelElement element={element} opts={opts} render={renderElement} />
      case 'page':
        // page can appear as nested element in certain configurations
        return <FlowPanelElement element={element} opts={opts} render={renderElement} />
      default:
        return <FlowPanelElement element={element} opts={opts} render={renderElement} />
    }
  }

  const question = element

  switch (type) {
    case 'comment':
      return <CommentElement question={question} opts={opts} />

    case 'boolean':
      return <BooleanElement question={question} opts={opts} />

    case 'radiogroup':
      return <ChoiceElement question={question} isMulti={false} opts={opts} />

    case 'checkbox':
      return <ChoiceElement question={question} isMulti={true} opts={opts} />

    case 'dropdown':
      return <DropdownElement question={question} opts={opts} />

    case 'tagbox':
      return <TagboxElement question={question} opts={opts} />

    case 'buttongroup':
      return <ButtonGroupElement question={question} opts={opts} />

    case 'ranking':
      return <RankingElement question={question} opts={opts} />

    case 'imagepicker':
      return <ImagePickerElement question={question} opts={opts} />

    case 'file':
      return <FileElement question={question} opts={opts} />

    case 'signaturepad':
      return <SignaturePadElement question={question} opts={opts} />

    case 'paneldynamic':
      return <PanelDynamicElement question={question} opts={opts} render={renderElement} />

    case 'matrix':
      return <MatrixElement question={question} opts={opts} />

    case 'matrixdropdown':
      return <MatrixDropdownElement question={question} opts={opts} />

    case 'matrixdynamic':
      return <MatrixDynamicElement question={question} opts={opts} />

    case 'html':
      return <HtmlElement question={question} opts={opts} />

    case 'image':
      return <ImageElement question={question} opts={opts} />

    case 'expression':
      return <ExpressionElement question={question} opts={opts} />

    case 'empty':
      return <EmptyElement question={question} opts={opts} />

    case 'rating':
      return <RatingElement question={question} opts={opts} />

    case 'multipletext':
      return <MultipleTextElement question={question} opts={opts} />

    case 'text':
    default:
      return <TextElement question={question} opts={opts} />
  }
}
