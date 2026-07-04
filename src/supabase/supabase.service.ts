import { Injectable } from '@nestjs/common';
import { createClient, CreateOAuthClientParams, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    public admin:SupabaseClient=createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    )
}
