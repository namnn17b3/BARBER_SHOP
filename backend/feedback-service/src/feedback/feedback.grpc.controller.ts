import { FeedbackService } from '@feedback/feedback.service';
import { Controller } from '@nestjs/common';
import {
  FeedbackServiceController,
  FeedbackServiceControllerMethods,
  GetListHairStyleRequest,
} from '@protos/feedback';

@FeedbackServiceControllerMethods()
@Controller()
export class FeedbackGrpcController implements FeedbackServiceController {
  constructor(private readonly feedbackService: FeedbackService) {}

  getListHairStyle(request: GetListHairStyleRequest) {
    return this.feedbackService.getListHairStyles(request);
  }
}
