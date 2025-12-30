import { success, errorResponse } from '../_lib/utils';
import { getItem, setItem, createId } from '../_lib/data-store';
import { requireAuth } from '../_lib/middleware';
import type { Request } from '../_lib/types';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return errorResponse('Authentication required', 401);
    }

    const body = await request.json();
    
    const user = await getItem('users', auth.userId);

    if (!user || user.role !== 'agent') {
      return errorResponse('Only agents can submit KYC documents', 403);
    }

    // Create KYC document records
    const documents = [];
    if (body.idFront) {
      const docId = createId('kyc');
      await setItem('kyc_documents', docId, {
        id: docId,
        user_id: auth.userId,
        document_type: 'id_card',
        document_url: body.idFront,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      documents.push(docId);
    }

    if (body.businessLicense) {
      const docId = createId('kyc');
      await setItem('kyc_documents', docId, {
        id: docId,
        user_id: auth.userId,
        document_type: 'business_registration',
        document_url: body.businessLicense,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      documents.push(docId);
    }

    // Update user KYC status
    const updatedUser = {
      ...user,
      kyc_status: 'pending',
      kyc_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setItem('users', auth.userId, updatedUser);

    return success({
      kycStatus: 'pending',
      documents: documents.length,
      message: 'KYC documents submitted successfully',
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to submit KYC documents', 500);
  }
}

