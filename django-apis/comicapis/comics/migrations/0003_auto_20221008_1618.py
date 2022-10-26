# Generated by Django 3.2.5 on 2022-10-08 09:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('comics', '0002_auto_20220815_1712'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChapterView',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('views', models.IntegerField(default=0)),
                ('chapter', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='comics.chapter')),
            ],
        ),
        migrations.DeleteModel(
            name='ComicView',
        ),
    ]
