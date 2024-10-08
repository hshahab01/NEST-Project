import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ContactService } from './contact.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateContactDto, EditContactDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('contacts')
export class ContactController {
    constructor(
        private ContactService: ContactService,
    ){}

    @Post()
    createContact(
        @GetUser() user: User,
        @Body() dto: CreateContactDto,
    ){
        return this.ContactService.createContact(
            user,
            dto
        );
    }

    @Get()
    getContacts(@GetUser() user: User){
        return this.ContactService.getContacts(user);
    }

    @Get(':id')
    getContactById(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) contactId: number
    ){
        return this.ContactService.getContactById(
            user,
            contactId
        );
    }

    @Patch(':id')
    editContactById(
        @GetUser('id') user: User,
        @Body() dto: EditContactDto,
        @Param('id', ParseIntPipe) contactId: number,
    ){
        return this.ContactService.editContactById(
            user,
            dto,
            contactId,
        );
    }

    @Delete(':id')
    deleteContact(
        @GetUser('id') user: User,
        @Param('id', ParseIntPipe) contactId: number
    ){
        return this.ContactService.deleteContact(
            user,
            contactId
        );
    }
}
