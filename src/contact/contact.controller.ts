import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Authorized, GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { CreateContactDto, EditContactDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'contacts' })
@ApiTags("Contacts")
export class ContactController {
    constructor(
        private ContactService: ContactService,
    ){}

    @Authorized()
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

    @Authorized()
    @Get()
    getContacts(@GetUser() user: User){
        return this.ContactService.getContacts(user);
    }

    @Authorized()
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

    @Authorized()
    @Patch(':id')
    editContactById(
        @GetUser() user: User,
        @Body() dto: EditContactDto,
        @Param('id', ParseIntPipe) contactId: number,
    ){
        return this.ContactService.editContactById(
            user,
            dto,
            contactId,
        );
    }

    @Authorized()
    @Delete(':id')
    deleteContact(
        @GetUser() user: User,
        @Param('id', ParseIntPipe) contactId: number
    ){
        return this.ContactService.deleteContact(
            user,
            contactId
        );
    }
}
