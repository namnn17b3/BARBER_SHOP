import { AuthenGuard } from '@common/guards/authen.guard';
import { UserFeedbackGuard } from '@common/guards/user-feedback.guard';
import { FormattedParseIntPipe } from '@common/validate-pipe/formatted-parse-int.pipe';
import { FormattedValidationPipe } from '@common/validate-pipe/formatted-validation.pipe';
import {
  GetListFeedbackRequestByHairStyleDto,
  SaveFeedbackRequestDto,
} from '@feedback/feedback.dto';
import { FeedbackService } from '@feedback/feedback.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

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

  @UseGuards(AuthenGuard)
  @Get('/order/:orderId')
  getFeedbackByOrderId(
    @Param('orderId', new FormattedParseIntPipe('params', 'orderId'))
    orderId: number,

    @Body('user') user: any,
  ) {
    return this.feedbackService.getFeedbackByOrderId(orderId, user);
  }

  @UseGuards(AuthenGuard)
  @Post()
  createNewFeedback(
    @Body(new FormattedValidationPipe('SaveFeedbackRequestDto'))
    saveFeedbackRequestDto: SaveFeedbackRequestDto,
  ) {
    return this.feedbackService.createNewFeedback(saveFeedbackRequestDto);
  }

  @UseGuards(AuthenGuard)
  @Put(':id')
  updateFeedback(
    @Param('id', new FormattedParseIntPipe('params', 'id')) id: number,

    @Body(new FormattedValidationPipe('SaveFeedbackRequestDto'))
    saveFeedbackRequestDto: SaveFeedbackRequestDto,
  ) {
    return this.feedbackService.updateFeedback({
      ...saveFeedbackRequestDto,
      id,
    });
  }

  @UseGuards(AuthenGuard)
  @Delete(':id')
  deleteFeedback(
    @Param('id', new FormattedParseIntPipe('params', 'id')) id: number,
    @Body('user') user: any,
  ) {
    return this.feedbackService.deleteFeedback(id, user);
  }
}
