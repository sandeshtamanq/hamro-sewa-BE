import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/Contact.Entity';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repository: Repository<Contact>,
  ) {}

  async create(contact: Partial<Contact>) {
    try {
      const newContact = await this.repository.save(
        this.repository.create(contact),
      );

      if (!newContact) return null;

      return newContact;
    } catch (err) {
      return null;
    }
  }

  async find() {
    return this.repository.createQueryBuilder('c').getMany();
  }

  async findOne(id: number) {
    return this.repository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();
  }
  async softRemove(contact: Partial<Contact>) {
    await this.repository.softRemove(contact);
  }
}
