[//]: # (title: Kotlin 로드맵)

<table>
    <tr>
        <td><strong>최종 수정일</strong></td>
        <td><strong>2025년 8월</strong></td>
    </tr>
    <tr>
        <td><strong>다음 업데이트</strong></td>
        <td><strong>2026년 2월</strong></td>
    </tr>
</table>

Kotlin 로드맵에 오신 것을 환영합니다! JetBrains 팀의 우선순위를 살짝 엿보세요.

## 주요 우선순위

이 로드맵의 목표는 전체적인 그림을 보여드리는 것입니다.
다음은 저희의 주요 집중 영역, 즉 제공에 중점을 두고 있는 가장 중요한 방향 목록입니다:

*   **언어 발전**: 구문 변경보다 의미론에 중점을 둔 의미 있는 언어 개선을 통해 Kotlin을 실용적이고 표현력이 풍부하게 유지합니다.
*   **멀티플랫폼**: 견고한 iOS 지원, 성숙한 웹 타겟, 안정적인 IDE 도구를 통해 현대적인 멀티플랫폼 앱을 위한 기반을 구축합니다.
*   **독립성 유지**: 개발자의 도구나 타겟에 관계없이 지원합니다.
*   **생태계 지원**: Kotlin 라이브러리, 도구, 프레임워크의 개발 및 게시 프로세스를 간소화합니다.

## 서브시스템별 Kotlin 로드맵

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

로드맵 또는 로드맵 항목에 대한 질문이나 피드백이 있다면 [YouTrack 티켓](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 또는 Kotlin Slack의 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 채널에 자유롭게 게시해 주세요([초대 요청](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>서브시스템</th>
        <th>현재 집중 분야</th>
    </tr>
    <tr id="language">
        <td><strong>언어</strong></td>
        <td>
            <p>Kotlin 언어 기능 및 제안의 <a href="kotlin-language-features-and-proposals.md">전체 목록을 확인</a>하거나 <a href="https://youtrack.jetbrains.com/issue/KT-54620">예정된 언어 기능에 대한 YouTrack 이슈</a>를 팔로우하세요.</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>컴파일러</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm: 새로운 스레드 제안을 활용한 멀티스레딩 지원 프로토타입 개발</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecify 지원 최종화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">K1 컴파일러 사용 중단</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (<code>wasm-js</code> 타겟)을 베타로 승격</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>멀티플랫폼</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">Swift Export에서 코루틴 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS: 최신 JavaScript로 컴파일</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS: Kotlin 선언을 JavaScript로 내보내는 기능 확장</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS: Kotlin/JS 온보딩 자료 개선</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GC 기본 활성화</a></li>
                <li><a href="https://youtrack.com/issue/KT-68323">차세대 멀티플랫폼 라이브러리 배포 형식 구현</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">모든 Kotlin 타겟 간 인라인 시맨틱 통일</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib 아티팩트의 증분 컴파일 기본 활성화</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin 멀티플랫폼 개발 로드맵</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>도구</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSP 및 VS Code 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">Kotlin + JPA 경험 개선</a></li>
                <li>🆕 <a href="https://youtrack.com/issue/KT-80311" target="_blank">Gradle 프로젝트 격리에서 Kotlin JS\WASM 지원</a></li>
                <li>🆕 <a href="https://youtrack.com/issue/KTNB-1133" target="_blank">Kotlin 노트북: 새로운 사용 사례 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEA에서 Kotlin/Wasm 프로젝트 개발 경험 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">임포트 성능 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 모드 정식 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">빌드 도구 API 설계</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">선언적 Gradle을 지원하는 Kotlin 생태계 플러그인 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin 스크립팅 및 <code>.gradle.kts</code> 경험 개선</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>생태계</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">KDoc 기계 판독 가능(machine-readable) 표현 구현</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">Kotlin 노트북 안정화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">Kotlin DataFrame 1.0 릴리스</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">Kandy 0.9 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">사용되지 않는 non-unit 값을 반환하는 Kotlin 함수에 대한 기본 경고/오류 도입</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">표준 라이브러리를 위한 새로운 멀티플랫폼 API: 유니코드 및 코드포인트 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code> 라이브러리 안정화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 배포 UX 개선: 코드 커버리지 및 바이너리 호환성 검증 추가</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code>을 베타로 승격</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">Ktor 클라이언트 및 서버 애플리케이션을 위한 OpenAPI 명세 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">Ktor 관리 및 관측 가능성(Observability) 개선</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTC 클라이언트</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">생성기 플러그인 및 튜토리얼을 통해 Ktor에 gRPC 지원 추가</a></li>
                <li><a href="https://youtrack.com/issue/KTOR-6026">Kubernetes 생성기 플러그인 생성</a></li>
                <li><a href="https://youtrack.com/issue/KTOR-6621">의존성 주입 사용 간소화</a></li>
                <li><a href="https://youtrack.com/issue/KTOR-7938">HTTP/3 지원</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBC 지원 추가</a></li>
            </list>
         </td>
    </tr>
</table>

> * 이 로드맵은 팀이 작업 중인 모든 것을 망라하는 목록이 아니며, 가장 큰 프로젝트만 포함합니다.
> * 특정 버전에서 특정 기능이나 수정 사항을 제공하겠다는 약속은 없습니다.
> * 진행 상황에 따라 우선순위를 조정하고 약 6개월마다 로드맵을 업데이트할 예정입니다.
> 
{style="note"}

## 2025년 2월 이후 변경 사항

### 완료된 항목

이전 로드맵에서 다음 항목들을 **완료**했습니다:

*   ✅ 멀티플랫폼: [Swift Export의 첫 공개 릴리스](https://youtrack.jetbrains.com/issue/KT-64572)
*   ✅ 멀티플랫폼: [프로젝트 수준에서 Kotlin 멀티플랫폼 의존성 선언 지원](https://youtrack.jetbrains.com/issue/KT-71289)
*   ✅ 멀티플랫폼: [다양한 플랫폼에서 klib 교차 컴파일 안정화](https://youtrack.jetbrains.com/issue/KT-71290)
*   ✅ 멀티플랫폼: [Kotlin/JS: Compose 폴백 모드(fallback Mode)를 위한 WasmJS와 JS 간 공통 소스 지원](https://youtrack.jetbrains.com/issue/KT-79394)
*   ✅ 도구: [Kotlin 빌드 리포트 개선](https://youtrack.jetbrains.com/issue/KT-60279)
*   ✅ 도구: [Gradle DSL에서 안정적인 컴파일러 인자 노출](https://youtrack.jetbrains.com/issue/KT-55515)
*   ✅ 도구: [Gradle 프로젝트 격리 지원](https://youtrack.jetbrains.com/issue/KT-54105)
*   ✅ 도구: [Kotlin/Native 툴체인과 Gradle 통합 개선](https://youtrack.jetbrains.com/issue/KT-64577)
*   ✅ 도구: [Kotlin 노트북: 더 원활한 접근 및 개선된 경험](https://youtrack.jetbrains.com/issue/KTNB-898)
*   ✅ 도구: [XCFramework에서 리소스 지원](https://youtrack.jetbrains.com/issue/KT-75377)
*   ✅ 생태계: [Dokka HTML 출력 UI 개선](https://youtrack.jetbrains.com/issue/KT-71295)
*   ✅ 생태계: [백엔드 애플리케이션의 프로젝트 구조화 간소화](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   ✅ 생태계: [CLI 생성기를 SNAP에 배포](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   ✅ 생태계: [의존성 주입 사용 간소화](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 새로운 항목

로드맵에 다음 항목들을 **추가**했습니다:

*   🆕 컴파일러: [Kotlin/Wasm: 새로운 스레드 제안을 활용한 멀티스레딩 지원 프로토타입 개발](https://youtrack.jetbrains.com/issue/KT-80304)
*   🆕 멀티플랫폼: [Swift Export에서 코루틴 지원](https://youtrack.jetbrains.com/issue/KT-80305)
*   🆕 멀티플랫폼: [Kotlin/JS: 최신 JavaScript로 컴파일](https://youtrack.jetbrains.com/issue/KT-80308)
*   🆕 멀티플랫폼: [Kotlin/JS: Kotlin 선언을 JavaScript로 내보내는 기능 확장](https://youtrack.jetbrains.com/issue/KT-80310)
*   🆕 멀티플랫폼: [Kotlin/JS: Kotlin/JS 온보딩 자료 개선](https://youtrack.jetbrains.com/issue/KT-80307)
*   🆕 도구: [Kotlin LSP 및 VS Code 지원](https://youtrack.jetbrains.com/issue/KT-80322)
*   🆕 도구: [Kotlin + JPA 경험 개선](https://youtrack.jetbrains.com/issue/KTIJ-35208)
*   🆕 도구: [Gradle 프로젝트 격리에서 Kotlin JS\WASM 지원](https://youtrack.jetbrains.com/issue/KT-80311)
*   🆕 도구: [Kotlin 노트북: 새로운 사용 사례 지원](https://youtrack.jetbrains.com/issue/KTNB-1133)
*   🆕 생태계: [KDoc 기계 판독 가능(machine-readable) 표현 구현](https://youtrack.jetbrains.com/issue/KT-80323)
*   🆕 생태계: [Kotlin 노트북 안정화](https://youtrack.jetbrains.com/issue/KT-80324)
*   🆕 생태계: [Kotlin DataFrame 1.0 릴리스](https://youtrack.jetbrains.com/issue/KT-80327)
*   🆕 생태계: [Kandy 0.9 릴리스](https://youtrack.jetbrains.com/issue/KT-80328)
*   🆕 생태계: [Ktor 클라이언트 및 서버 애플리케이션을 위한 OpenAPI 명세 지원](https://youtrack.jetbrains.com/issue/KTOR-8316)
*   🆕 생태계: [Ktor 관리 및 관측 가능성(Observability) 개선](https://youtrack.jetbrains.com/issue/KTOR-6622)
*   🆕 생태계: [WebRTC 클라이언트](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 제거된 항목

로드맵에서 다음 항목들을 **제거**했습니다:

*   ❌ 컴파일러: [Kotlin/Wasm: 라이브러리의 `wasm-wasi` 타겟을 WASI Preview 2로 전환](https://youtrack.jetbrains.com/issue/KT-64568)
*   ❌ 컴파일러: [Kotlin/Wasm: Component Model 지원](https://youtrack.jetbrains.com/issue/KT-64569)
*   ❌ 생태계: [SNAP에 게시](https://youtrack.jetbrains.com/issue/KTOR-3937)

> * 일부 항목은 로드맵에서 제거되었지만 완전히 중단된 것은 아닙니다.
> * 경우에 따라 이전 로드맵 항목을 현재 항목과 통합했습니다.
> 
{style="note"}