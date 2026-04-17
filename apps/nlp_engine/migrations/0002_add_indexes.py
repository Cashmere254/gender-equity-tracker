from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [('nlp_engine', '0001_initial')]
    operations = [
        migrations.RunSQL(
            'CREATE INDEX IF NOT EXISTS idx_narrative_program ON documents_narrative (program_id);',
            'DROP INDEX IF EXISTS idx_narrative_program;'
        ),
        migrations.RunSQL(
            'CREATE INDEX IF NOT EXISTS idx_extraction_indicator ON nlp_engine_aiextraction (indicator_id);',
            'DROP INDEX IF EXISTS idx_extraction_indicator;'
        ),
        migrations.RunSQL(
            'CREATE INDEX IF NOT EXISTS idx_extraction_confidence ON nlp_engine_aiextraction (confidence DESC);',
            'DROP INDEX IF EXISTS idx_extraction_confidence;'
        ),
    ]
