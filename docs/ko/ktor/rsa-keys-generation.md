[//]: # (title: RSA 키 생성)

<show-structure for="chapter" depth="2"/>

<var name="example_name" value="auth-jwt-rs256"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[RSA (Rivest–Shamir–Adleman)](https://en.wikipedia.org/wiki/RSA_(cryptosystem))는 안전한 데이터 전송, 디지털 서명 및 키 교환을 가능하게 하는 널리 사용되는 공개 키 암호 시스템입니다.

RSA 암호화 알고리즘의 일부인 RS256은 SHA-256을 해싱에 활용하고 키(일반적으로 2048비트, 4096비트 이상)를 사용하여 디지털 통신을 보호합니다.

[JSON 웹 토큰](https://jwt.io/) 인증 영역에서 RS256은 중요한 역할을 합니다. JWT의 무결성 및 진정성은 RS256과 같은 서명 메커니즘을 통해 검증될 수 있으며, 여기서 공개/개인 키 쌍이 사용됩니다. 이는 토큰에 포함된 정보가 위변조되지 않고 신뢰할 수 있음을 보장합니다.

이 섹션에서는 Ktor가 제공하는 [인증 JWT](server-jwt.md) 플러그인과 함께 이러한 키가 어떻게 생성되고 사용되는지 알아봅니다.

<warning>
<p>
프로덕션 환경에서는 RSA보다 효율적이고 안전한 암호화를 기반으로 하는 <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ES256</a>과 같은 최신 대안을 선택하는 것이 좋습니다.
</p>
</warning>

## RSA 개인 키 생성하기

개인 키를 생성하려면 OpenSSL, `ssh-keygen` 또는 인증 키 쌍 생성에 사용할 수 있는 다른 도구를 사용할 수 있습니다. 여기서는 시연 목적으로 OpenSSL을 사용합니다.

새 터미널 창에서 다음 명령을 실행하세요.

<code-block lang="shell">
openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 &gt; ktor.pk8
</code-block>

[openssl genpkey](https://www.openssl.org/docs/man3.0/man1/openssl-genpkey.html) 명령은 RSA 알고리즘을 사용하여 2048비트 개인 키를 생성하고 지정된 파일(여기서는 `ktor.pk8`)에 저장합니다. 파일의 내용은 [Base64](https://en.wikipedia.org/wiki/Base64)로 인코딩되어 있으므로 공개 키를 파생하기 전에 디코딩해야 합니다.

> [코드 예시](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256/)의 개인 키를 사용하려면, `src/main/resources` 내의 `application.conf` 파일로 이동하여 개인 키를 새 `.pk8` 파일로 추출하세요.
>
{style="tip"}

## 공개 키 파생하기 {id="second-step"}

이전에 생성한 개인 키에서 공개 키를 파생하려면 다음 단계를 수행해야 합니다.

1. 개인 키를 디코딩합니다.
2. 공개 키를 추출합니다.
3. 공개 키를 PEM 형식으로 저장합니다.

OpenSSL을 사용하여 이를 수행하려면 다음 명령을 실행하세요.

<code-block lang="shell">
openssl rsa -in ktor.pk8 -pubout | tee ktor.spki
</code-block>

*   `openssl rsa`: 이 명령은 RSA 키 작업에 사용되는 `OpenSSL` 명령입니다. 여기서는 RSA 키와 관련된 작업을 수행하는 데 사용됩니다.
*   `-in ktor.pk8`: 이 옵션은 OpenSSL이 RSA 개인 키를 읽어야 할 입력 파일(`ktor.pk8`)을 지정합니다.
*   `-pubout`: 이 옵션은 OpenSSL에게 입력 파일에 제공된 개인 키에 해당하는 공개 키를 출력하도록 지시합니다.
*   `|`: 파이프(`|`) 기호는 이전 명령(openssl rsa에 의해 생성된 공개 키)의 출력을 `tee` 명령으로 리다이렉션하는 데 사용됩니다.
*   `tee ktor.spki`: `tee`는 표준 입력에서 읽어 표준 출력과 하나 이상의 파일에 모두 기록하는 명령줄 유틸리티입니다. 이 명령 부분은 `tee`에게 수신된 입력을 `ktor.spki`라는 파일에 기록하도록 지시합니다. 따라서 공개 키는 터미널에 표시되고 `ktor.spki` 파일에 저장됩니다.

공개 키를 확보했으므로 이제 해당 지수(exponent) 및 계수(modulus) 값을 파생할 수 있습니다.

## 계수 및 지수 속성 추출하기

이제 키 쌍을 확보했으므로 `jwks.json` 파일에서 사용하기 위해 공개 키의 `e` (지수) 및 `n` (계수) 속성을 추출해야 합니다. 여기에는 다음 단계가 필요합니다.

1. 생성한 `.spki` 파일에서 공개 키를 읽습니다.
2. 키에 대한 정보를 사람이 읽을 수 있는 형식으로 표시합니다.

OpenSSL을 사용하여 이를 수행하려면 다음 명령을 실행하세요.

<code-block lang="shell">
openssl pkey -in ktor.spki -pubin -noout -text
</code-block>

*   `pkey`: 이 명령은 개인 및 공개 키를 처리하기 위한 OpenSSL 명령줄 유틸리티입니다.
*   `-in ktor.spki`: PEM 형식의 공개 키가 포함된 입력 파일을 지정합니다. 이 경우 입력 파일은 `ktor.spki`입니다.
*   `-pubin`: 입력 파일에 공개 키가 포함되어 있음을 나타냅니다. 이 옵션이 없으면 OpenSSL은 입력 파일에 개인 키가 포함되어 있다고 가정합니다.
*   `-noout`: 이 옵션은 OpenSSL이 인코딩된 공개 키를 출력하는 것을 방지합니다. 명령은 공개 키에 대한 정보만 표시하며, 실제 키는 콘솔에 출력되지 않습니다.
*   `-text`: OpenSSL이 키의 텍스트 표현을 표시하도록 요청합니다. 여기에는 키 유형, 크기 및 사람이 읽을 수 있는 형식의 실제 키 데이터와 같은 세부 정보가 포함됩니다.

예상 출력은 다음과 같습니다.

```Shell
$ openssl pkey -in ktor.spki -pubin -noout -text
RSA Public-Key: (512 bit)
Modulus:
    00:b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01
Exponent: 65537 (0x10001)
```

<warning>
<p>
이 예시에서는 공개 키가 512비트를 사용하며, 이는 안전하지 않습니다. 이상적으로는 2048비트 또는 4096비트 키를 선택해야 합니다.
</p>
</warning>

## 계수 및 지수 속성 변환 및 인코딩하기

이전 단계에서 `jwks.json` 파일에 필요한 `n` 및 `e` 속성을 추출했습니다. 하지만 이들은 16진수 형식입니다. 이제 지수 및 계수의 16진수 표현을 해당 [Base64URL](https://en.wikipedia.org/wiki/Base64#URL_applications) 인코딩으로 변환해야 합니다.

### 지수

지수 속성은 `0x10001`의 16진수 값을 가집니다. 이 값을 Base64URL로 변환하려면 다음 명령을 사용하세요.

<code-block lang="shell">
echo 010001 | xxd -p -r | base64 
</code-block>

*   `echo 010001`: 이 명령 부분은 `echo` 명령을 사용하여 RSA 키의 공개 지수(e)를 나타내는 문자열 "010001"을 표준 출력으로 내보냅니다.
*   `|`: `|` 문자는 이전 명령의 출력을 받아 다음 명령의 입력으로 전달하는 파이프입니다.
*   `xxd -p -r`: 이 명령은 16진수를 이진수로 변환하는 데 사용됩니다. 16진수 입력을 받아 해당 이진수 출력을 생성합니다.
*   `| base64`: 이 명령 부분은 이전 단계의 이진 출력을 받아 `base64` 명령을 사용하여 Base64 형식으로 인코딩합니다.

<note>
<p>
왼쪽에 추가 0을 붙여 짝수 개의 16진수 숫자가 사용되었다는 점에 유의하세요.
</p>
</note>

앞서 언급된 지수 값에 대한 예상 출력은 다음과 같습니다.

```Shell
$ echo 010001 | xxd -p -r | base64
AQAB
```

지수의 Base64URL로 인코딩된 값은 `AQAB`이며, 이 경우 추가 처리가 필요하지 않습니다. 다른 경우에는 다음 단계에서 보여주는 `tr` 명령을 사용해야 할 수도 있습니다.

### 계수

`n` 속성의 경우, `tr` 유틸리티를 사용하여 계수의 16진수 표현을 추가로 처리합니다.

<code-block lang="shell">
echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01" | tr -d ": 
" | xxd -p -r | base64 | tr +/ -_ | tr -d "=
"
</code-block>

<note>
<p>
선행 00 바이트가 생략되었다는 점에 유의하세요. 계수의 선행 00 바이트는 RSA 공개 키의 ASN.1 인코딩과 관련이 있습니다. 정수의 ASN.1 DER 인코딩에서는 정수의 최상위 비트가 0이면 선행 0 바이트가 제거됩니다. 이는 ASN.1 인코딩 규칙의 표준 부분입니다. RSA 공개 키의 맥락에서, 계수는 빅 엔디안 정수이며, DER 인코딩으로 표현될 때 이러한 규칙을 따릅니다. 선행 0 바이트를 제거하는 것은 DER 규칙에 따라 정수가 올바르게 해석되도록 하기 위해 수행됩니다.
</p>
</note>

*   `echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5: \ ... "`: 이 명령 부분은 여러 줄의 16진수 문자열을 에코하며, 이는 일련의 바이트를 나타냅니다. 각 줄 끝의 백슬래시는 줄 계속을 나타냅니다.
*   `tr -d ": 
"`: `tr` 명령은 인자 목록에 지정된 문자를 삭제하는 데 사용됩니다. 여기서는 16진수 문자열에서 콜론, 공백 및 개행 문자를 제거하여 연속된 16진수 문자열로 만듭니다.
*   `xxd -p -r`: `xxd`는 이진 파일의 헥스 덤프를 생성하거나 헥스 덤프를 다시 이진수로 변환하는 유틸리티입니다. `-p` 옵션은 줄 번호나 ASCII 문자 열 없이 일반 헥스 덤프를 지정합니다. `-r` 옵션은 작업을 역으로 수행하여 헥스(hex)를 다시 이진수로 변환합니다.
*   `base64`: 이전 단계의 이진 출력을 Base64 형식으로 인코딩합니다.
*   `tr +/ -_`: Base64 출력의 + 및 / 문자를 각각 - 및 _로 변환합니다. 이는 URL 안전 Base64 인코딩을 위한 일반적인 수정입니다.
*   `tr -d "=
"`: 최종 Base64로 인코딩된 문자열에서 모든 등호(=)와 개행 문자를 제거합니다.

위 명령의 출력은 다음과 같습니다.

```Shell
$ echo "b5:f2:5a:2e:bc:d7:20:b5:20:d5:4d:cd:d4:a5:
    7c:c8:9a:fd:d8:61:e7:e4:eb:58:65:1e:ea:5a:4d:
    4c:73:87:32:e0:91:a3:92:56:2e:a7:bc:1e:32:30:
    43:f5:fd:db:05:5a:08:b2:25:15:5f:ac:4d:71:82:
    2b:d0:87:b4:01" | tr -d ": 
" | xxd -p -r | base64 | tr +/ -_ | tr -d "=
"
tfJaLrzXILUg1U3N1KV8yJr92GHn5OtYZR7qWk1Mc4cy4JGjklYup7weMjBD9f3bBVoIsiUVX6xNcYIr0Ie0AQ
```

`tr` 명령을 적절히 활용하여 계수 필드가 `jwks.json` 파일에서 사용할 수 있는 Base64URL 문자열로 인코딩되었습니다.

## jwks.json 파일 채우기

이전 단계에서 다음 필수 정보를 수집했습니다.

1. RSA 키 쌍.
2. Base64URL 형식의 RSA 공개 키 계수.
3. Base64URL 형식의 RSA 공개 키 지수.

이 정보를 바탕으로 이제 Ktor 프로젝트의 [jwks.json](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) 파일을 다음 속성으로 채울 수 있습니다.

- 이전 단계에서 생성한 Base64URL로 인코딩된 `e` 및 `n` 값.
- 키 ID (이 경우, `kid`는 샘플 프로젝트에서 파생됩니다).
- `kty` 속성을 `RSA`로.

```json
{
  "keys": [
    {
      "kty": "RSA",
      "e": "AQAB",
      "kid": "6f8856ed-9189-488f-9011-0ff4b6c08edc",
      "n":"tfJaLrzXILUg1U3N1KV8yJr92GHn5OtYZR7qWk1Mc4cy4JGjklYup7weMjBD9f3bBVoIsiUVX6xNcYIr0Ie0AQ"
    }
  ]
}
```

남은 유일한 단계는 Ktor 프로젝트가 인증에 사용할 수 있도록 개인 키를 지정하는 것입니다.

## 개인 키 정의하기

공개 키 정보가 설정되었으므로 마지막 단계는 Ktor 프로젝트에 개인 키에 대한 접근 권한을 부여하는 것입니다.

생성한 개인 키(처음에 `.pk8` 파일에 생성)를 시스템의 환경 변수(이 경우 `jwt_pk`라고 함)로 추출했다고 가정하면, `resources/application.conf` 파일의 jwt 섹션은 다음과 유사하게 보여야 합니다.

```
jwt {
  privateKey = ${jwt_pk}
  issuer = "http://0.0.0.0:8080/"
  audience = "http://0.0.0.0:8080/login"
  realm = "MyProject"
}
```

<warning>
<p>
개인 키는 민감한 정보로 간주되므로 코드에 직접 저장해서는 안 됩니다. 민감한 데이터에 환경 변수 또는 <a href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html">보안 저장소(secret store)</a>를 사용하는 것을 고려하세요.
</p>
</warning>