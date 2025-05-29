[//]: # (title: Kotlin 로드맵)

<table>
    <tr>
        <td><strong>최종 수정일</strong></td>
        <td><strong>2025년 2월</strong></td>
    </tr>
    <tr>
        <td><strong>다음 업데이트</strong></td>
        <td><strong>2025년 8월</strong></td>
    </tr>
</table>

Kotlin 로드맵에 오신 것을 환영합니다! JetBrains 팀의 우선순위를 미리 확인해 보세요.

## 주요 우선순위

이 로드맵의 목표는 전체적인 그림을 보여드리는 것입니다.
다음은 저희가 제공하는 데 주력하고 있는 가장 중요한 방향인 핵심 집중 영역 목록입니다:

*   **언어 발전**: 더 효율적인 데이터 처리, 향상된 추상화, 명확한 코드를 통한 성능 향상.
*   **Kotlin Multiplatform**: Kotlin-Swift 직접 익스포트(Export) 출시, 간소화된 빌드 설정, 멀티플랫폼 라이브러리 생성 간소화.
*   **타사 생태계 작성자 경험**: Kotlin 라이브러리, 도구, 프레임워크 개발 및 게시 프로세스 간소화.

## 하위 시스템별 Kotlin 로드맵

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

로드맵 또는 로드맵 항목에 대한 질문이나 피드백이 있으시면 [YouTrack 티켓](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 또는 Kotlin Slack의 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 채널에 자유롭게 게시해 주세요([초대 요청](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>하위 시스템</th>
        <th>현재 중점 사항</th>
    </tr>
    <tr id="language">
        <td><strong>언어</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">Kotlin 언어 기능 및 제안의 전체 목록 보기</a> 또는 <a href="https://youtrack.jetbrains.com/issue/KT-54620">예정된 언어 기능에 대한 YouTrack 이슈</a>를 팔로우하세요.</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>컴파일러</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecify 지원 완료</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1 컴파일러 사용 중단</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm(`wasm-js` 타겟)을 베타로 승격</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: 라이브러리의 `wasm-wasi` 타겟을 WASI Preview 2로 전환</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Component Model 지원</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>멀티플랫폼</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Export의 첫 공개 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">기본적으로 동시 마크 앤 스윕(CMS) GC 활성화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">다른 플랫폼에서의 klib 교차 컴파일 안정화</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">멀티플랫폼 라이브러리의 차세대 배포 형식 구현</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">프로젝트 수준에서 Kotlin Multiplatform 종속성 선언 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">모든 Kotlin 타겟 간 인라인(inline) 시맨틱 통일</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">기본적으로 klib 아티팩트의 증분 컴파일 활성화</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform 개발 로드맵</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>툴링</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEA에서 Kotlin/Wasm 프로젝트 개발 경험 개선</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">임포트(import) 성능 개선</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">XCFramework에서 리소스 지원</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: 더 원활한 접근 및 향상된 경험</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 모드 정식 릴리스</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">빌드 툴(Build Tools) API 설계</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">선언형(Declarative) Gradle을 지원하는 Kotlin Ecosystem 플러그인</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Gradle 프로젝트 격리 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Gradle에 Kotlin/Native 툴체인 통합 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Kotlin 빌드 리포트 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Gradle DSL에서 안정적인 컴파일러 인자(arguments) 노출</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin 스크립팅 및 `.gradle.kts` 사용 경험 개선</a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>라이브러리 생태계</strong></td>
        <td>
            <p><b>라이브러리 생태계 로드맵 항목:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Dokka HTML 출력 UI 개선</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">사용되지 않는 비단위(non-unit) 값을 반환하는 Kotlin 함수에 대한 기본 경고/오류 도입</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">표준 라이브러리를 위한 새로운 멀티플랫폼 API: 유니코드(Unicode) 및 코드포인트(codepoints) 지원</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">`kotlinx-io` 라이브러리 안정화</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 배포 UX 개선: 코드 커버리지 및 바이너리 호환성 검증 추가</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">`kotlinx-datetime`을 베타로 승격</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">생성기(generator) 플러그인 및 튜토리얼을 통해 Ktor에 gRPC 지원 추가</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">백엔드 애플리케이션의 프로젝트 구조화 간소화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLI 생성기를 SNAP으로 게시</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetes 생성기(Generator) 플러그인 생성</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">의존성 주입(Dependency Injection) 사용 간소화</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 지원</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0 릴리스</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBC 지원 추가</a></li>
            </list>
         </td>
    </tr>
</table>

> * 이 로드맵은 팀이 작업 중인 모든 것을 망라하는 목록이 아니며, 가장 큰 프로젝트만 포함합니다.
> * 특정 버전에서 특정 기능이나 수정 사항을 제공하겠다는 약속은 없습니다.
> * 저희는 진행하면서 우선순위를 조정하고 약 6개월마다 로드맵을 업데이트할 것입니다.
> 
{style="note"}

## 2024년 9월 이후 변경 사항

### 완료된 항목

이전 로드맵에서 다음 항목을 **완료**했습니다:

*   ✅ 컴파일러: <a href="https://youtrack.jetbrains.com/issue/KT-60276">Android에서 인라인(inline) 함수 디버깅 지원</a>
*   ✅ 컴파일러: <a href="https://youtrack.jetbrains.com/issue/KT-71275">컴파일러 진단 품질 개선</a>
*   ✅ 멀티플랫폼: <a href="https://youtrack.jetbrains.com/issue/KT-71287">Kotlin에서 Xcode 16 지원</a>
*   ✅ 멀티플랫폼: <a href="https://youtrack.jetbrains.com/issue/KT-71288">Kotlin Gradle 플러그인에 대한 공개적으로 사용 가능한 API 레퍼런스 게시</a>
*   ✅ 툴링: <a href="https://youtrack.jetbrains.com/issue/KT-71276">Kotlin/Wasm 타겟을 위한 즉시 사용 가능한 디버깅 경험 제공</a>
*   ✅ 라이브러리 생태계: <a href="https://youtrack.jetbrains.com/issue/KT-71293">Dokkatoo 기반의 새로운 Dokka Gradle 플러그인 구현</a>
*   ✅ 라이브러리 생태계: <a href="https://youtrack.jetbrains.com/issue/KT-62423">표준 라이브러리를 위한 새로운 멀티플랫폼 API: 아토믹스(Atomics)</a>
*   ✅ 라이브러리 생태계: <a href="https://youtrack.jetbrains.com/issue/KT-71299">라이브러리 작성자 가이드라인 확장</a>

### 신규 항목

다음 항목을 로드맵에 **추가**했습니다:

*   🆕 컴파일러: <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecify 지원 완료</a>
*   🆕 컴파일러: <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1 컴파일러 사용 중단</a>
*   🆕 컴파일러: <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm(`wasm-js` 타겟)을 베타로 승격</a>
*   🆕 툴링: <a href="https://youtrack.jetbrains.com/issue/KT-75374">IntelliJ IDEA에서 Kotlin/Wasm 프로젝트 개발 경험 개선</a>
*   🆕 툴링: <a href="https://youtrack.jetbrains.com/issue/KT-75376">임포트(import) 성능 개선</a>
*   🆕 툴링: <a href="https://youtrack.jetbrains.com/issue/KT-75377">XCFramework에서 리소스 지원</a>
*   🆕 툴링: <a href="https://youtrack.jetbrains.com/issue/KTNB-898">Kotlin Notebook에서 더 원활한 접근 및 향상된 경험</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">생성기(generator) 플러그인 및 튜토리얼을 통해 Ktor에 gRPC 지원 추가</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">백엔드 애플리케이션의 프로젝트 구조화 간소화</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLI 생성기를 SNAP으로 게시</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetes 생성기(Generator) 플러그인 생성</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">의존성 주입(Dependency Injection) 사용 간소화</a>
*   🆕 Ktor: <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 지원</a>
*   🆕 Exposed: <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0 릴리스</a>
*   🆕 Exposed: <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBC 지원 추가</a>

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 진행 중인 항목

이전에 확인된 다른 모든 로드맵 항목들은 현재 진행 중입니다. 업데이트를 위해 <a href="https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20">YouTrack 티켓</a>을 확인할 수 있습니다.