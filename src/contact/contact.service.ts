import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateContactDto, EditContactDto } from './dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService){}

    async createContact(user: User, dto: CreateContactDto){
        //save user
        try{
        const contact = await this.prisma.contact.create({
            data: {
                name: dto.name,
                number: dto.number,
                userId: user.id
            },
        });
        return contact;
        }
        catch(error)
        {
        throw error;
        }
    }

    getContacts(user: User){
        return this.prisma.contact.findMany({
            where: {
                userId: user.id
            }
        })
    }

    getContactById(user: User, contactId: number){
        return this.prisma.contact.findMany({
            where: {
                userId: user.id,
                id: contactId,
            }
        })
    }

    async editContactById(user: User, dto: EditContactDto, contactId: number){
        const Contact = await this.prisma.contact.update({
            where: {
                userId: user.id,
                id: contactId
            },
            data: {
                ...dto,
            },
        });

        return Contact;
    }

    async deleteContact(user: User, contactId: number){
        try{
            await this.prisma.contact.delete({
                where: {
                    userId: user.id,
                    id: contactId,
                },
            });
            return "Contact deleted successfully";
            }
            catch (error) {
                throw new HttpException({
                  status: HttpStatus.NOT_FOUND,
                  error: 'Contact not found',
                }, HttpStatus.NOT_FOUND, {
                  cause: error
                });
              }
    }
     
}

    