import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Report } from './report.entity';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('/reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Serialize(ReportDto)
  @Post('/')
  @UseGuards(AuthGuard)
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<Report> {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: number,
    @Body() body: ApproveReportDto,
  ): Promise<Report> {
    console.log('Approve report');
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get('/')
  getEstimate(@Query() query: GetEstimateDto) {}
}
