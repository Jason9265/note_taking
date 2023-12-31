# Generated by Django 4.2.5 on 2023-12-14 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('note_taking', '0002_alter_note_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='note',
            name='tags',
        ),
        migrations.AddField(
            model_name='note',
            name='tags',
            field=models.ManyToManyField(blank=True, to='note_taking.tag'),
        ),
    ]
