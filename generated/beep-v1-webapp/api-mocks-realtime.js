/**
 * 实时捕获的 API Mock - 基于真实的 beep-v1-webapp API 响应
 * 自动生成时间: 2025-07-26T06:41:57.277Z
 * 已捕获 4 个端点，共 6 次调用
 * 
 * 捕获的域名:
 * - coffee.beep.local.shub.us
 */

import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v3/storage/selected-address', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "code": "00000",
    "message": "OK",
    "description": "OK",
    "pagination": null,
    "data": {
        "addressInfo": {
            "placeId": "ChIJH5xmLdE3zDERKa4a_IywVck",
            "fullName": "KLCC, Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia",
            "shortName": "KLCC",
            "coords": {
                "lat": 3.1572757,
                "lng": 101.7122335
            },
            "countryCode": "MY",
            "postCode": "50088",
            "city": "Kuala Lumpur"
        }
    },
    "extra": null
})
    );
  }),

  rest.post('/api/gql/OnlineStoreInfo', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
    "data": {
        "onlineStoreInfo": {
            "id": "67220fa8a2b284a465794eaf",
            "storeName": "Coffee Bean (Webstore)",
            "beepBrandName": "Bean",
            "logo": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/logo/logo_fcd4e7ea-6946-4f33-d2e0-ddd8e5e1f4cb",
            "favicon": "https://d16kpilgrxu9w6.cloudfront.net/coffee/online-store/appearance/image/favicon/favicon_b9d856a6-e469-4c7d-dc8d-c14e7916c93a",
            "locale": "MS-MY",
            "currency": "MYR",
            "currencySymbol": "RM",
            "country": "MY",
            "state": null,
            "street": null,
            "analyticTools": [],
            "businessType": "cafe"
        }
    }
})
    );
  }),

  rest.post('/api/gql/CoreStores', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json("\u001f�\b\u0000\u0000\u0000\u0000\u0000\u0000\u0003�mo�8\u0010ǿJdiu{R���\u0003�6m��d��mO��$�\u0018\u0012��N!���;!@)e{�bO��\u001a\t\u0012�=\u0019�㙟�#�������9��p^>3�\u0010TCa:\u001a\u0011�d$hB\u001eRVjuN�\u001f�8��y2�3�&\f\u000fc\u0012�\u0005��,'2��:YD2�n{D\b���&��$O�)��)C5�ȔQ�IO�\u0019\u0019�C?��\\Аo\\U��IL�IV<W}�:,�e`��4\u001fdd\u0015\u001f��<�e\u0014Q^��4����=�it�\u000b\b�/M�eC6e�f��!/^�&�\u0017U�)\n���)��V��:�.�h�+�K\u0019�rե�GD#0�lMSF�&�k�\u001cEQlU\u001dZ�\u0003\u001e�[�\\m�o\\j�\u0011�>\u0007��<�q�;�P�|��C\"� �f-���[*p�j#\u001csR\u0006�\u0011\"Tp��V��V�IE!5\t�Y�1��\b\u0006!L홯L�(C\u001c�\u0018\u0017x,\u0005$�d��\u001c3i�4Ls�[�h_�0NC\\��#<3\b/�����G����e�\rXT�~���f8�R]*$r��#\u001a�\t��YUV�T��\u001a\u0019\u00054��3t��l�YH���6��Vz3�[���w���]��h�\u0011<}�'�\u000e6=T����\u0019���ӈ�族�l\u0006�~1[��M��\b���6̆4�\u000f�����\fl��\"\u0013k�\u000e;&\tf��ɵc�����T�4��K�\u0017n\u0012��h|�~\u001b␐Y#�\u001f�Rul�`�*yU%��\u000b���FtQ���n\u001ec>��\u000b��������Ik(a:]$N�+<\u001b\u0003]�;Q&�y��ݦ�k����;;��퇢ӎO�w�4��\u0011��=Z�O�q,[7�\u0010c9���W\u0011���OA�*K��I�ɐ�R#�R!5(������Q\\˶�=�\u0018��X��\u0017.\u0007zk�<�\u001b./���-�l���,���,�&>D��;\u0017�\u0017m�˷\u0010�\u0011+���nO\u001d7��tn�'��2f\u0013���ykA�~쵹��\u001e���)�\f5��k�\u001aV��\"�QK�\u0007d�:��\u0014�X\u0000\u0015h}&\u0005\u0018PB@�F. \u0001�4\u0013�\u001d�\u0004y�s)��B�\u000e4�~��w^\r\u001dʑn��j;��0�t�pm�r��?#�\u001c+rȶ��\u001bz����\u001b��n�\u001e��ׇ�ă�kÞ�Q'\t��\u0014�^>xlp�]�h#�A�z�p\u001c�U��\u0015�����@��\u001d�8�m\u0018�\t؈�\b\u0018bi�\u001aF֫g����e�JP��;�\u001b����\tŴ5۴?N(\u001f'������|�5g�y|�ߦ��\u001b�X��@��\u0007��\u001d\u001f�a�:\u001b\u000e�4-Ȣu՛\br�8��W�.Z�,���\t��\u0018�\u0012\u0000\u0000")
    );
  }),

  rest.post('/api/gql/CoreBusiness', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json("\u001f�\b\u0000\u0000\u0000\u0000\u0000\u0000\u0003�V�n�6\u0010�\u0015�/m\u0001m*)���[b'۠N��n�6\b\u0016cid\u0013�H-I%�\u0006��\u000eu�-ɶ\u000f\u0005�<8��h8s�̡^X\u0002\u0016��\u000b[\u0014�K4�}��!;c�JSD�1�3�����\u001b\u000e?�\\����\"�\u000bMn��\u00108�gvfu�\u001e�旻�NPs����I�cg�\u001fy��\u0015�%eMA��o\bf��x}��\u001c�\bOP�V��nS�'���~�;�d��\u0010G��+�QݦX�X��r%g\u0016la\\��叮�\\����Y�\t/�� %�-JrA�(�Q�=3�\u000f(���\u000f{\u0001d�0[�6+��\u001c\u000f\u001eK0�Bر*Aؒj䊝��G`\u0017�j���A\u0019\u0012n���a����/��w��ҿ�7���\u0015���3��y\u0019�5�C\u0013�<+����\u0018t�;�z\u001e+\fάҸ*\u0016c����شxS=��O\u0005\u001a��\u0011\n�M�����1}N��n����٧\u001a���N��\u0004ʝ�)�\u0011\u0004OFP��B���z=/zh�s\u001a�+�2\u0002/��|����\u0004=\u000b�ښ4��\u0001�mjN\u001a�fDbN\u0010�Y��\u000b�n*�~\u0018�)\f���O\u0007����`\u0011-��;\u000b2�w�ܠ]���R�)�����\tw���҈m�\u0016�t�v��y�f�\u000e8��f�@�s\u0011��\u0012�\u0013\u000b���aTo���\u0000�M�\u0010�Q��5�@�r�\u0012<����y�c3lH\u0005�幭���Ģ\u001cSk;\u0012�\u0019n��\u0015�M�D�0\u0003�\u001c:�Ĩ]�3��g�^)�*M\u0006ϭ���oK4n\t\\����\u000f��\u0006�O���j/�3�!������\\qm�\u000fNGV�rF~\u0010���9�<�{n�k�N(\u001bɲD�\r��Jm;��v�ܖ�!�T8\u0019���Z�br\u001d�W!�\b��9�\t�:԰�ua\u000b����#\t�\u0018#��\u001c3R\"��械�\\�Q��P�h8�Pr�m��7���~\u0010\u0006Qԥ\u0018��ͧ'Ao\u0010v\u0007a��\u001fP��\u0010)\u0017\"��&y3e�l�(\u001e��x]�N>5>r|���v2�V�G\u0013���8���3����b�\u0016����\u0003�k�\u0002A��\\]8�<n�hV�)w\u0017��U�\u0010`t���s�dIڶ���+���碾ȶ�WN��v�ڭ\u000e�\u000b\u0018�!-s�\u000fQ�\u0017����s�oÇ*�꽼���g�ɯ��Z߫UqD�7G\u001d���+���7\u0010E�\u0005�ݐ�c2S\u0005\u0005�\n\u0006^ߋ����5��:_5�duo]���VK\r\u0019\u0019�p��+�yԜ�*�_��\u0015\u0018�)p���\u001a+��t�\nL����\u000eP��F�\u001f�V(t�@����r���tz}��5\n�w�k\u001c�B�[\b��j�V����}ؽ�N�� =�\u001d����/j��H�\n\u0000\u0000")
    );
  })
];

// API 模式统计
export const apiStats = [
  {
    "pattern": "GET /api/v3/storage/selected-address",
    "calls": 1,
    "domains": [
      "coffee.beep.local.shub.us"
    ],
    "hasData": true
  },
  {
    "pattern": "POST /api/gql/OnlineStoreInfo",
    "calls": 2,
    "domains": [
      "coffee.beep.local.shub.us"
    ],
    "hasData": true
  },
  {
    "pattern": "POST /api/gql/CoreStores",
    "calls": 2,
    "domains": [
      "coffee.beep.local.shub.us"
    ],
    "hasData": true
  },
  {
    "pattern": "POST /api/gql/CoreBusiness",
    "calls": 1,
    "domains": [
      "coffee.beep.local.shub.us"
    ],
    "hasData": true
  }
];
