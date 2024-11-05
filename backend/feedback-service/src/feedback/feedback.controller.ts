import { UserFeedbackGuard } from '@common/guards/user-feedback.guard';
import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import { GetListFeedbackRequestByHairStyleDto } from '@feedback/feedback.dto';
import { FeedbackService } from '@feedback/feedback.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

@Controller('/api/feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(UserFeedbackGuard)
  @Get()
  getListFeedbackByHairStyle(
    @Query(new FormattedValidationPipe('GetListFeedbackRequestByHairStyleDto'))
    query: GetListFeedbackRequestByHairStyleDto,
  ) {
    return this.feedbackService.getListFeedbackByHairStyle(query);
  }

  @Get('/statistics')
  getFeedbackStatisticsInfo(
    @Query('hairStyleId', new FormattedParseIntPipe('query', 'hairStyleId'))
    hairStyleId: number,
  ) {
    return this.feedbackService.getFeedbackStatisticsInfo(hairStyleId);
  }
}
