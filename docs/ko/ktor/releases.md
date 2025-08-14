[//]: # (title: Ktor 릴리스)

<show-structure for="chapter" depth="2"/>

Ktor는 [시맨틱 버전](https://semver.org/)을 따릅니다:

- _메이저 버전_ (x.0.0)에는 호환되지 않는 API 변경 사항이 포함됩니다.
- _마이너 버전_ (x.y.0)은 이전 버전과 호환되는 새로운 기능을 제공합니다.
- _패치 버전_ (x.y.z)에는 이전 버전과 호환되는 수정 사항이 포함됩니다.

각 메이저 및 마이너 릴리스마다, 새로운 기능을 출시 전에 사용해 볼 수 있도록 여러 미리 보기(EAP) 버전을 함께 제공합니다. 자세한 내용은 [얼리 액세스 프로그램](https://ktor.io/eap/)을 참조하세요.

## Gradle 플러그인 {id="gradle"}

[Gradle Ktor 플러그인](https://github.com/ktorio/ktor-build-plugins)은 프레임워크와 동일한 릴리스 주기를 따릅니다. 모든 플러그인 릴리스는 [Gradle 플러그인 포털](https://plugins.gradle.org/plugin/io.ktor.plugin)에서 찾을 수 있습니다.

## IntelliJ Ultimate 플러그인 {id="intellij"}

[IntelliJ Ktor 플러그인](https://www.jetbrains.com/help/idea/ktor.html)은 Ktor 프레임워크와는 독립적으로 릴리스되며, [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/other.html)와 동일한 릴리스 주기를 사용합니다.

### 새 릴리스로 업데이트 {id="update"}

IntelliJ Ktor 플러그인을 사용하면 Ktor 프로젝트를 최신 버전으로 마이그레이션할 수 있습니다. 자세한 내용은 [프로젝트 마이그레이션](https://www.jetbrains.com/help/idea/ktor.html#migrate) 섹션에서 알아볼 수 있습니다.

## 릴리스 세부 정보 {id="release-details"}

다음 표는 최신 Ktor 릴리스에 대한 세부 정보를 나열합니다.

<table>
<tr><td>버전</td><td>릴리스 날짜</td><td>주요 내용</td></tr>
<tr><td>3.2.3</td><td>July 29, 2025</td><td>
<p>
YAML 설정 처리, DI 해상도, Wasm/JS 안정성에 대한 개선 사항과 함께 멀티파트 파싱, CIO <code>100 Continue</code> 응답 형식 지정, <code>ByteReadChannel</code>의 무한 읽기 루프, 서버 종료 문제에 대한 수정 사항을 도입하는 패치 릴리스입니다.
</p>
<var name="version" value="3.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.2.2</td><td>July 14, 2025</td><td>
<p>
SSE 필드 직렬화 순서를 개선하고, CORS 프리플라이트 처리, 테스트 애플리케이션 스트리밍, 구성 역직렬화 버그, 그리고 wasmJs 및 Darwin 대상에 영향을 미치는 3.2.1의 회귀를 포함한 플랫폼 전반의 헤더 누락과 같은 여러 문제를 해결하는 패치 릴리스입니다.
</p>
<var name="version" value="3.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.2.1</td><td>July 4, 2025</td><td>
<p>
시간 API, 템플릿, 게시 기능 개선 사항과 함께 3.2.0에서 도입된 플러그인 동작, Netty, OkHttp, 시작 문제에 대한 중요한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="3.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.2.0</td><td>June 12, 2025</td><td>
<p>
타입화된 구성 역직렬화, 새로운 의존성 주입 및 HTMX 모듈, Gradle 버전 카탈로그 지원, suspend 모듈 지원을 도입하는 마이너 릴리스입니다. 자세한 내용은 <Links href="/ktor/whats-new-320" summary="undefined">Ktor 3.2.0의 새로운 기능</Links>을 참조하세요.
</p>
<var name="version" value="3.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.1.3</td><td>May 5, 2025</td><td><p>
더 빠른 바이트 연산 및 멀티파트 처리와 같은 성능 개선, 그리고 더 안전한 토큰 새로 고침 처리를 포함하는 패치 릴리스입니다. 또한 메트릭의 메모리 문제를 수정하고, 헤더 동작을 개선하며, WebSockets, OkHttp, Apache5, Netty 전반의 버그를 해결합니다. 더불어 Kotlin 2.1.0 지원을 위해 JTE를 업데이트합니다.
</p>
<var name="version" value="3.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.1.2</td><td>March 27, 2025</td><td><p>
Kotlin을 2.1.20으로 업데이트하고, Base64 디코딩, 인증 토큰 삭제, Android 서버 시작 오류, WebSocket 헤더 형식 지정, SSE 세션 취소를 포함한 다양한 문제를 수정하는 패치 릴리스입니다.
</p>
<var name="version" value="3.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.1.1</td><td>February 24, 2025</td><td><p>
로깅을 개선하고 WebSocket 타임아웃 처리를 수정하는 패치 릴리스입니다. 이 릴리스는 HTTP 캐시 불일치, 폼 데이터 복사 오류, gzip 처리 충돌, 세그먼트 풀 손상을 유발하는 동시성 문제를 포함한 여러 버그를 수정합니다.
</p>
<var name="version" value="3.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.1.0</td><td>February 11, 2025</td><td><p>
다양한 SSE 기능과 확장된 CIO 엔진 및 WebSocket 지원을 도입하는 마이너 릴리스입니다. 이 릴리스는 바이트 채널 처리, HTTP 요청 실패, 동시성 문제와 관련된 중요한 버그를 수정하면서 플랫폼 호환성, 로깅, 인증 기능을 향상시킵니다.
</p>
<var name="version" value="3.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.3</td><td>December 18, 2024</td><td><p>
<code>browserProductionWebpack</code>의 빌드 오류, gzip 압축 콘텐츠 처리, <code>FormFieldLimit</code> 구성 덮어쓰기 수정을 포함한 다양한 버그 수정이 포함된 패치 릴리스입니다. 이 릴리스에는 또한 코어 성능 개선 및 적절한 테스트 애플리케이션 종료 기능이 포함됩니다.
</p>
<var name="version" value="3.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.2</td><td>December 4, 2024</td><td><p>
응답 손상, 잘린 본문, 연결 처리, 잘못된 헤더와 관련된 여러 버그 수정과 함께 확장된 바이너리 인코딩 지원 및 Android 성능 향상을 다루는 패치 릴리스입니다.
</p>
<var name="version" value="3.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.13</td><td>November 20, 2024</td><td><p>
<code>watchosDeviceArm64</code> 대상에 대한 지원 추가를 포함하여 버그 수정, 보안 패치 및 개선 사항이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.13"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.1</td><td>October 29, 2024</td><td><p>
클라이언트 및 서버 로깅 개선 사항과 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="3.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.0</td><td>October 9, 2024</td><td><p>
Android Native 대상에 대한 지원 추가를 포함하여 개선 사항 및 버그 수정이 포함된 메이저 릴리스입니다. 호환성이 깨지는 변경 사항에 대한 자세한 내용은 <Links href="/ktor/migrating-3" summary="undefined">마이그레이션 가이드</Links>를 참조하세요.
</p>
<var name="version" value="3.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-2</td><td>October 2, 2024</td><td><p>
호환성이 깨지는 변경 사항, 버그 수정, 그리고 XML에 대한 멀티플랫폼 지원과 같은 기능을 포함한 다양한 개선 사항이 포함된 메이저 릴리스 후보입니다.
</p>
<var name="version" value="3.0.0-rc-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-rc-1</td><td>September 9, 2024</td><td><p>
중요한 개선 사항 및 버그 수정이 포함된 메이저 릴리스 후보입니다. 이 업데이트는 이전 버전과의 호환성을 강화하고 확장된 <code>staticZip</code> 지원을 제공합니다.
</p>
<var name="version" value="3.0.0-rc-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-2</td><td>July 15, 2024</td><td><p>
SSE 지원 개선 및 Kotlin/Wasm용 Ktor 클라이언트를 포함하여 다양한 개선 사항과 버그 수정이 포함된 메이저 사전 릴리스 버전입니다.
</p>
<var name="version" value="3.0.0-beta-2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.12</td><td>June 20, 2024</td><td><p>
Ktor Core 및 Ktor Server의 버그 수정뿐만 아니라 Netty 및 OpenAPI의 버전 업데이트를 포함하는 패치 릴리스입니다.
</p>
<var name="version" value="2.3.12"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.11</td><td>May 9, 2024</td><td><p>
테스트 클라이언트 엔진에 소켓 타임아웃을 적용하는 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.11"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.10</td><td>April 8, 2024</td><td><p>
CallLogging 및 SSE 서버 플러그인에 대한 다양한 버그 수정, 향상된 Android 클라이언트 로깅 등이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.10"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.9</td><td>March 4, 2024</td><td><p>
ContentNegotiation 클라이언트 플러그인에 대한 버그 수정과 HTTP를 통해 보안 쿠키를 전송하는 지원이 추가된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.9"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.8</td><td>January 31, 2024</td><td><p>
URLBuilder, CORS 및 WebSocket 플러그인에 대한 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.7</td><td>December 7, 2023</td><td>
<p>
ContentNegotiation, WebSockets 및 Native Server의 메모리 사용량에 대한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.7"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>3.0.0-beta-1</td><td>November 23, 2023</td><td>
<p>
클라이언트 및 서버 SSE 지원을 포함하여 다양한 개선 사항과 버그 수정이 포함된 메이저 사전 릴리스 버전입니다.
</p>
<var name="version" value="3.0.0-beta-1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.6</td><td>November 7, 2023</td><td>
<p>
2.3.5의 호환성이 깨지는 변경 사항에 대한 수정 및 기타 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.6"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.5</td><td>October 5, 2023</td><td>
<p>
Darwin 및 Apache5 엔진 구성의 수정 사항이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.5"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.4</td><td>August 31, 2023</td><td>
<p>
HTTP Cookie 헤더 및 <code>NoTransformationFoundException</code> 오류에 대한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.3</td><td>August 1, 2023</td><td>
<p>
<code>linuxArm64</code>에 대한 클라이언트 및 서버 지원과 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.2</td><td>June 28, 2023</td><td>
<p>
Kotlin 버전이 <code>1.8.22</code>로 업그레이드되었으며 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.1</td><td>May 31, 2023</td><td>
<p>
서버 구성 개선 사항 및 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.3.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.3.0</td><td>April 19, 2023</td><td>
<p>
여러 구성 파일, 라우팅(Routing)의 정규 표현식 패턴 등에 대한 지원을 추가하는 기능 릴리스입니다.
</p>
<var name="version" value="2.3.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.2.4</td><td>February 28, 2023</td><td>
<p>
HTTP 클라이언트, 라우팅(Routing), ContentNegotiation의 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.4"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.2.3</td><td>January 31, 2023</td><td>
<p>
OAuth2에 대한 멀티플랫폼 기능 및 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.2.2</td><td>January 3, 2023</td><td>
<p>
<code>2.2.1</code>에 대한 버그 수정, Swagger 플러그인 개선 및 수정 등이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.2.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.2.1</td><td>December 7, 2022</td><td>
<p>
<code>2.2.0</code>의 <code>java.lang.NoClassDefFoundError: kotlinx/atomicfu/AtomicFU</code> 오류에 대한 패치 릴리스입니다.
</p>
<var name="version" value="2.2.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.2.0</td><td>December 7, 2022</td><td>
<p>
Swagger UI 호스팅, 새로운 플러그인 API, 세션(Sessions)에 대한 멀티플랫폼 지원 등을 포함하는 여러 기능이 포함된 릴리스입니다. 자세한 내용은 <Links href="/ktor/migration-to-22x" summary="undefined">2.0.x에서 2.2.x로 마이그레이션</Links> 가이드를 참조하세요.
</p>
<var name="version" value="2.2.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.1.3</td><td>October 26, 2022</td><td>
<p>
다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.1.2</td><td>September 29, 2022</td><td>
<p>
라우팅(Routing), 테스트 엔진, Ktor 클라이언트의 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.1.1</td><td>September 6, 2022</td><td>
<p>
Ktor 클라이언트 및 서버의 다양한 버그 수정이 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.1.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.1.0</td><td>August 11, 2022</td><td>
<p>
YAML 구성 지원 및 다양한 기타 개선 사항과 버그 수정이 추가된 마이너 릴리스입니다.
</p>
<var name="version" value="2.1.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.0.3</td><td>June 28, 2022</td><td>
<p>
버그 수정 및 <code>kotlinx.coroutines</code> 버전이 <code>1.6.2</code>로 업그레이드된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.3"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.0.2</td><td>May 27, 2022</td><td>
<p>
다양한 개선 사항, 버그 수정 및 종속성 버전 업그레이드가 포함된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.2"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.0.1</td><td>April 28, 2022</td><td>
<p>
다양한 버그 수정과 Kotlin 버전이 <code>1.6.21</code>로 업데이트된 패치 릴리스입니다.
</p>
<var name="version" value="2.0.1"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>2.0.0</td><td>April 11, 2022</td><td>
<p>
업데이트된 API 문서와 다양한 새로운 기능이 포함된 메이저 릴리스입니다. 호환성이 깨지는 변경 사항 및 <code>1.x.x</code>에서 마이그레이션하는 방법에 대한 자세한 내용은 <Links href="/ktor/migration-to-20x" summary="undefined">마이그레이션 가이드</Links>를 참조하세요.
</p>
<var name="version" value="2.0.0"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
<tr><td>1.6.8</td><td>March 15, 2022</td><td>
<p>
종속성 버전 업그레이드가 포함된 패치 릴리스입니다.
</p>
<var name="version" value="1.6.8"/>

    <p>
        <a href="https://github.com/ktorio/ktor/releases/tag/%version%">GitHub에서 변경 로그 보기</a>
    </p>
    
</td></tr>
</table>