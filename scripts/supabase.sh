#!/usr/bin/env bash
# =============================================================================
# ResuMesh Client - Supabase CLI Migration Helper Script
# =============================================================================
set -e

COMMAND="${1:-status}"
ARG="${2:-}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed!"
    echo "💡 Install via Homebrew: brew install supabase/tap/supabase"
    echo "💡 Install via npm: npm install -g supabase"
    exit 1
fi

case "$COMMAND" in
    "link")
        if [ -z "$ARG" ]; then
            echo "Usage: ./scripts/supabase.sh link <project-ref>"
            exit 1
        fi
        echo "🔗 Linking Supabase project ($ARG)..."
        supabase link --project-ref "$ARG"
        ;;
    "push")
        echo "🚀 Pushing migrations to Supabase Cloud..."
        supabase db push
        ;;
    "pull")
        echo "📥 Pulling remote schema from Supabase..."
        supabase db pull
        ;;
    "new")
        if [ -z "$ARG" ]; then
            echo "Usage: ./scripts/supabase.sh new <migration_name>"
            exit 1
        fi
        echo "📝 Creating new migration file: $ARG..."
        supabase migration new "$ARG"
        ;;
    "diff")
        echo "🔍 Generating migration diff from local database..."
        supabase db diff -f "${ARG:-diff_migration}"
        ;;
    "reset")
        echo "🔄 Resetting local Supabase database..."
        supabase db reset
        ;;
    "status")
        echo "📊 Checking Supabase migration status..."
        supabase migration list || supabase status
        ;;
    "start")
        echo "⚡ Starting local Supabase containers..."
        supabase start
        ;;
    "stop")
        echo "🛑 Stopping local Supabase containers..."
        supabase stop
        ;;
    *)
        echo "ResuMesh Supabase CLI Helper"
        echo "Usage: ./scripts/supabase.sh <command> [argument]"
        echo ""
        echo "Commands:"
        echo "  link <project-ref>  Link to remote Supabase project"
        echo "  push                Apply migrations to remote database"
        echo "  pull                Pull remote schema into local migration"
        echo "  new <name>          Create a new timestamped migration file"
        echo "  diff [name]         Generate diff migration file"
        echo "  status              View migration status"
        echo "  start               Start local Supabase stack"
        echo "  stop                Stop local Supabase stack"
        ;;
esac
