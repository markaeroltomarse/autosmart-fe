import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader(
    'Set-Cookie',
    'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );

  res.status(200).redirect('/');
}
