[//]: # (title: Kotlin 로드맵)

<table>
    <tr>
        <td><strong>최종 수정일</strong></td>
        <td><strong>2026년 2월</strong></td>
    </tr>
    <tr>
        <td><strong>다음 업데이트 예정</strong></td>
        <td><strong>2026년 8월</strong></td>
    </tr>
</table>

Kotlin 로드맵에 오신 것을 환영합니다! JetBrains 팀이 집중하고 있는 우선순위를 미리 확인해 보세요.

## 주요 우선순위

이 로드맵의 목표는 여러분에게 전체적인 그림을 보여드리는 것입니다.
다음은 저희가 제공하고자 하는 가장 중요한 방향성인 핵심 집중 분야 목록입니다:

* **언어의 진화(Language evolution)**: 구문(syntax)의 변화보다 의미론(semantics)을 강조하는 유의미한 개선을 통해 Kotlin의 실용성과 표현력을 유지합니다.
* **멀티플랫폼(Multiplatform)**: 견고한 iOS 지원, 성숙한 웹 타겟, 신뢰할 수 있는 IDE 툴링을 통해 현대적인 멀티플랫폼 앱의 기반을 구축합니다.
* **도구 독립성 유지(Staying agnostic)**: 개발자가 어떤 도구나 타겟을 사용하든 상관없이 지원합니다.
* **생태계 지원(Ecosystem support)**: Kotlin 라이브러리, 도구 및 프레임워크의 개발 및 배포 프로세스를 간소화합니다.

## 하위 시스템별 Kotlin 로드맵

<!-- 현재 진행 중인 가장 큰 프로젝트를 보려면 [로드맵 상세](#roadmap-details) 표를 참조하세요. -->

로드맵이나 로드맵의 항목에 대해 질문이나 피드백이 있는 경우, [YouTrack 티켓](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)에 게시하거나 Kotlin Slack의 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 채널([초대 요청](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))에 자유롭게 남겨주세요.

<!-- ### YouTrack 보드
이슈 트래커 YouTrack의 [로드맵 보드](https://youtrack.jetbrains.com/agiles/153-1251/current)를 방문하세요. ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>하위 시스템</th>
        <th>현재 집중 항목</th>
    </tr>
    <tr id="language">
        <td><strong>언어 (Language)</strong></td>
        <td>
            <p>Kotlin 언어 기능 및 제안의 <a href="kotlin-language-features-and-proposals.md">전체 목록을 확인</a>하거나, <a href="https://youtrack.jetbrains.com/issue/KT-54620">예정된 언어 기능에 대한 YouTrack 이슈</a>를 팔로우하세요.</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>컴파일러 (Compiler)</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">람다 반환 타입에 따른 오버로드 해소(overload resolution) 안정화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">공통 코드에 대한 K2 멀티플랫폼 증분 컴파일 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">새로운 JVM 리플렉션(reflection): 조사, 프로토타입 및 구현</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84568" target="_blank">Power-assert 플러그인 고도화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: 라이브러리의 <code>wasm-wasi</code> 타겟을 WASI Preview 2로 전환</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: 컴포넌트 모델(Component Model) 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-82064" target="_blank">Kotlin/Wasm: 멀티 모듈 컴파일 지원</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>멀티플랫폼 (Multiplatform)</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305" target="_blank">Swift Export: Alpha 출시</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84569" target="_blank">Compose Multiplatform을 위한 iOS 기반의 새로운 <code>TextInputService</code> 구현</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84570" target="_blank">Swift 6.3 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84571" target="_blank">Compose Multiplatform을 위한 Navigation3 안정화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323" target="_blank">멀티플랫폼 라이브러리의 차세대 배포 형식 구현</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">안정적인 Kotlin 타겟 간의 인라인(inline) 의미론 통일</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS: Kotlin/JS 온보딩 자료 개선</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS: 모던 자바스크립트(JavaScript)로 컴파일</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS: Kotlin 선언을 자바스크립트로 내보내기 위한 가능성 확장</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib 아티팩트의 증분 컴파일을 기본으로 활성화</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 멀티플랫폼 개발 로드맵</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>도구 (Tooling)</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native 디버거 상태(health) 및 성능 개선</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84573" target="_blank">Maven 기반 Kotlin(Java + Kotlin 혼합)을 위한 스마트 기본값 설정</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">Kotlin에서 Swift Package Manager 패키지 임포트 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">Karma 러너를 지원 중단(deprecated)되지 않은 대안으로 교체</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin 스크립팅 및 <code>.gradle.kts</code> 사용 경험 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Gradle 프로젝트 격리(Project Isolation)에서 Kotlin/JS 및 Kotlin/Wasm 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Build Tools API 설계</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Declarative Gradle을 지원하는 Kotlin 생태계 플러그인 출시</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSP 및 VS Code 지원</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>생태계 (Ecosystem)</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-83525" target="_blank">표준 라이브러리의 보안 수정 사항에 대한 18개월 지원 기간(support window) 도입</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">실험적인 <code>kotlinx.serialization</code> API 안정화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank"><code>kotlinx.collections.immutable</code> 안정화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">서버 사이드 Kotlin에서 Lombok 컴파일러 플러그인 사용 경험 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code>을 Beta로 승격</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">KDoc의 기계 판독 가능 표현 구현</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 배포 UX 개선: 코드 커버리지 및 바이너리 호환성 검증 추가</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">표준 라이브러리를 위한 새로운 멀티플랫폼 API: 유니코드(Unicode) 및 코드포인트(codepoints) 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code> 라이브러리 안정화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Unit이 아닌 값을 반환하지만 사용되지 않는 Kotlin 함수에 대해 기본 경고/오류 도입</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80324" target="_blank">Kotlin Notebooks 안정화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">Kotlin DataFrame 1.0 출시</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">Kandy 0.9 출시</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">Ktor 인증(authentication) 기능 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938" target="_blank">HTTP/3 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026" target="_blank">Kubernetes 생성기 플러그인 제작</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">생성기 플러그인 및 튜토리얼을 통해 Ktor에 gRPC 지원 추가</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">Ktor 관리 및 관측성(Observability) 개선</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-778" target="_blank">Exposed DAO 2.0 출시</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-755" target="_blank">마이그레이션 Gradle 플러그인 제작</a></li>
            </list>
         </td>
    </tr>
</table>

> * 이 로드맵은 팀이 작업 중인 모든 사항을 담은 포괄적인 목록이 아니며, 가장 큰 프로젝트들만 포함하고 있습니다.
> * 특정 버전에서 특정 기능이나 수정을 제공하겠다는 약속은 아닙니다.
> * 진행 상황에 따라 우선순위를 조정할 것이며, 대략 6개월마다 로드맵을 업데이트할 예정입니다.
> 
{style="note"}

## 2025년 8월 이후 변경 사항

### 완료된 항목

이전 로드맵에서 다음 항목들을 **완료**했습니다:

* ✅ Compiler: [JSpecify 지원 완료](https://youtrack.jetbrains.com/issue/KT-75371)
* ✅ Compiler: [K1 컴파일러 사용 중단(Deprecate) 예정](https://youtrack.jetbrains.com/issue/KT-75372)
* ✅ Compiler: [Kotlin/Wasm(`wasm-js` 타겟)을 Beta로 승격](https://youtrack.jetbrains.com/issue/KT-75370)
* ✅ Multiplatform: [Concurrent Mark and Sweep (CMS) GC를 기본으로 활성화](https://youtrack.jetbrains.com/issue/KT-71278)
* ✅ Multiplatform: [Kotlin Multiplatform IDE 플러그인에서 Windows 및 Linux 지원](https://youtrack.jetbrains.com/issue/KMT-789)
* ✅ Multiplatform: [Web용 Compose Multiplatform을 Beta로 출시](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)
* ✅ Multiplatform: [Compose Hot Reload 정식 출시(Stable)](https://blog.jetbrains.com/kotlin/2026/01/compose-multiplatform-1-10-0/)
* ✅ Tooling: [Kotlin + JPA 사용 경험 개선](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* ✅ Tooling: [Kotlin Notebooks: 새로운 유즈케이스 지원](https://youtrack.jetbrains.com/issue/KTNB-1133)
* ✅ Tooling: [IntelliJ IDEA에서 Kotlin/Wasm 프로젝트 개발 환경 개선](https://youtrack.jetbrains.com/issue/KT-75374)
* ✅ Tooling: [JS/Wasm 아티팩트를 위한 NPM 배포 추가](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.npm-publish)
* ✅ Tooling: [IntelliJ IDEA K2 모드 정식 출시](https://youtrack.jetbrains.com/issue/KTIJ-31316)
* ✅ Tooling: [임포트(imports) 성능 개선](https://youtrack.jetbrains.com/issue/KT-75376)
* ✅ Ecosystem: [Ktor 클라이언트 및 서버 애플리케이션을 위한 OpenAPI 사양 지원](https://youtrack.jetbrains.com/issue/KTOR-8316)
* ✅ Ecosystem: [Ktor WebRTC 클라이언트](https://youtrack.jetbrains.com/issue/KTOR-7958)
* ✅ Ecosystem: [Ktor에서 의존성 주입(Dependency Injection) 사용 간소화](https://youtrack.jetbrains.com/issue/KTOR-6621)
* ✅ Ecosystem: [Exposed 1.0.0 출시](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* ✅ Ecosystem: [Exposed에 R2DBC 지원 추가](https://youtrack.jetbrains.com/issue/EXPOSED-74)

### 새로운 항목

로드맵에 다음 항목들을 **추가**했습니다:

* 🆕 Compiler: [Kotlin/Wasm: 멀티 모듈 컴파일 지원](https://youtrack.jetbrains.com/issue/KT-82064)
* 🆕 Compiler: [Kotlin/Wasm: 라이브러리의 `wasm-wasi` 타겟을 WASI Preview 2로 전환](https://youtrack.jetbrains.com/issue/KT-64568)
* 🆕 Compiler: [Kotlin/Wasm: 컴포넌트 모델(Component Model) 지원](https://youtrack.jetbrains.com/issue/KT-64569)
* 🆕 Compiler: [람다 반환 타입에 따른 오버로드 해소 안정화](https://youtrack.jetbrains.com/issue/KT-51107)
* 🆕 Compiler: [공통 코드에 대한 K2 멀티플랫폼 증분 컴파일 지원](https://youtrack.jetbrains.com/issue/KT-84567)
* 🆕 Compiler: [새로운 JVM 리플렉션: 조사, 프로토타입 및 구현](https://youtrack.jetbrains.com/issue/KT-75463)
* 🆕 Compiler: [Power-assert 플러그인 고도화](https://youtrack.jetbrains.com/issue/KT-84568)
* 🆕 Multiplatform: [Swift Export: Alpha 출시](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 Multiplatform: [Compose Multiplatform을 위한 iOS 기반의 새로운 `TextInputService` 구현](https://youtrack.jetbrains.com/issue/KT-84569)
* 🆕 Multiplatform: [Swift 6.3 지원](https://youtrack.jetbrains.com/issue/KT-84570)
* 🆕 Multiplatform: [Compose Multiplatform을 위한 Navigation3 안정화](https://youtrack.jetbrains.com/issue/KT-84571)
* 🆕 Tooling: [Kotlin/Native 디버거 상태 및 성능 개선](https://youtrack.jetbrains.com/issue/KT-84572)
* 🆕 Tooling: [Maven 기반 Kotlin(Java + Kotlin 혼합)을 위한 스마트 기본값 설정](https://youtrack.jetbrains.com/issue/KT-84573)
* 🆕 Tooling: [Kotlin에서 Swift Package Manager 패키지 임포트 지원](https://youtrack.jetbrains.com/issue/KT-53877)
* 🆕 Tooling: [Karma 러너를 지원 중단되지 않은 대안으로 교체](https://youtrack.jetbrains.com/issue/KT-66897)
* 🆕 Ecosystem: [표준 라이브러리의 보안 수정 사항에 대한 18개월 지원 기간 도입](https://youtrack.jetbrains.com/issue/KT-83525)
* 🆕 Ecosystem: [실험적인 `kotlinx.serialization` API 안정화](https://youtrack.jetbrains.com/issue/KT-84574)
* 🆕 Ecosystem: [<code>kotlinx.collections.immutable</code> 안정화](https://youtrack.jetbrains.com/issue/KT-84575)
* 🆕 Ecosystem: [서버 사이드 Kotlin에서 Lombok 컴파일러 플러그인 사용 경험 개선](https://youtrack.jetbrains.com/issue/KT-84576)
* 🆕 Ecosystem: [Ktor 인증 기능 개선](https://youtrack.jetbrains.com/issue/KTOR-9266)
* 🆕 Ecosystem: [Exposed DAO 2.0 출시](https://youtrack.jetbrains.com/issue/EXPOSED-778)
* 🆕 Ecosystem: [Exposed를 위한 마이그레이션 Gradle 플러그인 제작](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### 삭제된 항목

로드맵에서 다음 항목을 **삭제**했습니다:

* ❌ Compiler: [Kotlin/Wasm: 새로운 threads 제안을 사용한 멀티스레딩 지원 프로토타입](https://youtrack.jetbrains.com/issue/KT-80304)

> 일부 항목은 로드맵에서 삭제되었으나 완전히 중단된 것은 아닙니다. 어떤 경우에는 이전 로드맵 항목을 현재 항목과 통합하기도 했습니다.
>
{style="note"}