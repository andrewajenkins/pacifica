# Generated by Django 3.2.7 on 2021-09-04 19:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    replaces = [('pacifica_visualizer', '0001_initial'), ('pacifica_visualizer', '0002_message'), ('pacifica_visualizer', '0003_message_user'), ('pacifica_visualizer', '0004_auto_20210904_1341'), ('pacifica_visualizer', '0005_auto_20210904_1404'), ('pacifica_visualizer', '0006_auto_20210904_1407'), ('pacifica_visualizer', '0007_auto_20210904_1412'), ('pacifica_visualizer', '0008_alter_message_message'), ('pacifica_visualizer', '0009_auto_20210904_1631'), ('pacifica_visualizer', '0010_auto_20210904_1953')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(default='FIRST_NAME_MISSING', max_length=70)),
                ('last_name', models.CharField(default='LAST_NAME_MISSING', max_length=70)),
                ('abcs_id', models.CharField(default='', max_length=200)),
                ('am_notes_id', models.CharField(default='', max_length=200)),
                ('pm_notes_id', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Sheet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(default='', max_length=70)),
                ('name', models.CharField(default='', max_length=200)),
                ('active', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ABC',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default='MISSING_TIMESTAMP', max_length=70)),
                ('staff', models.CharField(default='STAFF', max_length=70)),
                ('behavior', models.CharField(default='BEHAVIOR', max_length=5000)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pacifica_visualizer.client')),
                ('antecedent', models.CharField(default='ANTECEDENT', max_length=5000)),
                ('consequence', models.CharField(default='CONSEQUENCE', max_length=5000)),
                ('duration', models.CharField(default='DURATION', max_length=5000)),
                ('ipp', models.CharField(default='IPP', max_length=5000, null=True)),
                ('notes', models.CharField(default='NOTES', max_length=5000, null=True)),
                ('place', models.CharField(default='PLACE', max_length=5000)),
            ],
            options={
                'unique_together': {('timestamp', 'client', 'staff', 'behavior')},
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default='MISSING_TIMESTAMP', max_length=70)),
                ('message', models.CharField(default='MESSAGE', max_length=5000)),
                ('username', models.CharField(default='USERNAME', max_length=70)),
                ('user', models.CharField(default='USER', max_length=70)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='DailyNote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default='MISSING_TIMESTAMP', max_length=70)),
                ('staff', models.CharField(default='STAFF', max_length=70)),
                ('period', models.CharField(default='PERIOD', max_length=70)),
                ('notes', models.CharField(default='NOTES', max_length=5000, null=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pacifica_visualizer.client')),
            ],
            options={
                'ordering': ['-timestamp'],
                'unique_together': {('timestamp', 'client', 'staff', 'notes')},
            },
        ),
    ]
