---
title: "Kotlin 로드맵"
---
<table>
<tr>
<td>
<strong>Last modified on</strong>
</td>
<td>
<strong>February 2025</strong>
</td>
</tr>
<tr>
<td>
<strong>Next update</strong>
</td>
<td>
<strong>August 2025</strong>
</td>
</tr>
</table>

Kotlin 로드맵에 오신 것을 환영합니다! JetBrains 팀의 우선순위를 살짝 엿보세요.

## 주요 우선순위

이 로드맵의 목표는 큰 그림을 보여주는 것입니다.
다음은 당사의 주요 집중 영역(가장 중요한 추진 방향) 목록입니다.

* **언어 발전**: 보다 효율적인 데이터 처리, 향상된 추상화, 명확한 코드를 통한 성능 향상.
* **Kotlin Multiplatform**: Kotlin에서 Swift로 직접 내보내기 출시, 간소화된 빌드 설정, 멀티플랫폼 라이브러리 생성 간소화.
* **타사 에코시스템 작성자의 경험**: Kotlin 라이브러리, 도구 및 프레임워크에 대한 간소화된 개발 및 게시 프로세스.

## 하위 시스템별 Kotlin 로드맵

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

로드맵 또는 로드맵 항목에 대한 질문이나 피드백이 있으면 [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) 또는 Kotlin Slack의 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 채널에 자유롭게 게시하십시오([초대 요청](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->
<table>
<tr>
        <th>Subsystem</th>
        <th>In focus now</th>
</tr>
<tr id="language">
<td>
<strong>Language</strong>
</td>
<td>

<p>
   Kotlin 언어 기능 및 제안의 <a href="kotlin-language-features-and-proposals">전체 목록 보기</a> 또는 예정된 언어 기능에 대한 <a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack issue</a>를 팔로우하세요.
</p>
</td>
</tr>
<tr id="compiler">
<td>
<strong>Compiler</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecify 지원 완료</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1 컴파일러 사용 중단</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (`wasm-js` target)을 베타로 승격</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: 라이브러리의 `wasm-wasi` target을 WASI Preview 2로 전환</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Component Model 지원</a></li>
</list>
</td>
</tr>
<tr id="multiplatform">
<td>
<strong>Multiplatform</strong>
</td>
<td>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Export의 첫 번째 공개 릴리스</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GC를 기본적으로 활성화</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71290">서로 다른 플랫폼에서 klib 교차 컴파일 안정화</a></li> 
<li><a href="https://youtrack.jetbrains.com/issue/KT-71281">멀티플랫폼 라이브러리의 차세대 배포 형식 구현</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71289">프로젝트 수준에서 Kotlin Multiplatform 종속성 선언 지원</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">모든 Kotlin target 간에 인라인 의미 체계 통합</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib 아티팩트의 증분 컴파일을 기본적으로 활성화</a></li>
</list>
            <tip><p>
   <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform 개발 로드맵</a>
</p></tip>
</td>
</tr>
<tr id="tooling">
<td>
<strong>Tooling</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEA에서 Kotlin/Wasm 프로젝트의 개발 경험 개선</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">imports 성능 개선</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">XCFrameworks에서 리소스 지원</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: 더욱 원활한 액세스 및 개선된 환경</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 모드 전체 릴리스</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">Build Tools API 설계</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">선언적 Gradle을 지원하는 Kotlin Ecosystem Plugin</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Gradle 프로젝트 격리 지원</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Kotlin/Native 툴체인을 Gradle에 통합 개선</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Kotlin 빌드 보고서 개선</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Gradle DSL에서 안정적인 컴파일러 인수 노출</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin 스크립팅 및 `.gradle.kts` 환경 개선</a></li>
</list>
</td>
</tr>
<tr id="library-ecosystem">
<td>
<strong>Library ecosystem</strong>
</td>
<td>

<p>
   <b>Library ecosystem 로드맵 항목:</b>
</p>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Dokka HTML 출력 UI 개선</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">사용되지 않는 non-unit 값을 반환하는 Kotlin 함수에 대한 기본 경고/오류 도입</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">표준 라이브러리에 대한 새로운 멀티플랫폼 API: 유니코드 및 코드 포인트 지원</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">`kotlinx-io` 라이브러리 안정화</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 배포 UX 개선: 코드 커버리지 및 바이너리 호환성 유효성 검사 추가</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">`kotlinx-datetime`을 베타로 승격</a></li>
</list>
<p>
   <b>Ktor:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">생성기 플러그인 및 튜토리얼을 사용하여 Ktor에 gRPC 지원 추가</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">백엔드 애플리케이션에 대한 프로젝트 구조화 단순화</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLI 생성기를 SNAP에 게시</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetes Generator Plugin 생성</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">Dependency Injection 사용법 간소화</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 지원</a></li>
</list>
<p>
   <b>Exposed:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">릴리스 1.0.0</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBC 지원 추가</a></li>
</list>
</td>
</tr>
</table>
:::note
* 이 로드맵은 팀이 진행 중인 모든 작업을 망라한 목록이 아니며 가장 큰 프로젝트만 해당됩니다.
* 특정 버전에서 특정 기능 또는 수정 사항을 제공하겠다는 약속은 없습니다.
* 진행하면서 우선순위를 조정하고 약 6개월마다 로드맵을 업데이트합니다.

:::

## 2024년 9월 이후 변경 사항

### 완료된 항목

이전 로드맵에서 다음 항목이 **완료**되었습니다.

* ✅ Compiler: [Android에서 인라인 함수 디버깅 지원](https://youtrack.jetbrains.com/issue/KT-60276)
* ✅ Compiler: [컴파일러 진단의 품질 개선](https://youtrack.jetbrains.com/issue/KT-71275)
* ✅ Multiplatform: [Kotlin에서 Xcode 16 지원](https://youtrack.jetbrains.com/issue/KT-71287)
* ✅ Multiplatform: [Kotlin Gradle Plugin에 대한 공개적으로 사용 가능한 API 참조 게시](https://youtrack.jetbrains.com/issue/KT-71288)
* ✅ Tooling: [Kotlin/Wasm target에 즉시 사용 가능한 디버깅 환경 제공](https://youtrack.jetbrains.com/issue/KT-71276)
* ✅ Library ecosystem: [Dokkatoo를 기반으로 하는 새로운 Dokka Gradle 플러그인 구현](https://youtrack.jetbrains.com/issue/KT-71293)
* ✅ Library ecosystem: [표준 라이브러리에 대한 새로운 멀티플랫폼 API: Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
* ✅ Library ecosystem: [라이브러리 작성자 가이드라인 확장](https://youtrack.jetbrains.com/issue/KT-71299)

### 새로운 항목

로드맵에 다음 항목이 **추가**되었습니다.

* 🆕 Compiler: [JSpecify 지원 완료](https://youtrack.jetbrains.com/issue/KT-75371)
* 🆕 Compiler: [K1 컴파일러 사용 중단](https://youtrack.jetbrains.com/issue/KT-75372)
* 🆕 Compiler: [Kotlin/Wasm (`wasm-js` target)을 베타로 승격](https://youtrack.jetbrains.com/issue/KT-75370)
* 🆕 Tooling: [IntelliJ IDEA에서 Kotlin/Wasm 프로젝트의 개발 경험 개선](https://youtrack.jetbrains.com/issue/KT-75374)
* 🆕 Tooling: [imports 성능 개선](https://youtrack.jetbrains.com/issue/KT-75376)
* 🆕 Tooling: [XCFrameworks에서 리소스 지원](https://youtrack.jetbrains.com/issue/KT-75377)
* 🆕 Tooling: [Kotlin Notebook에서 더욱 원활한 액세스 및 개선된 환경](https://youtrack.jetbrains.com/issue/KTNB-898)
* 🆕 Ktor: [생성기 플러그인 및 튜토리얼을 사용하여 Ktor에 gRPC 지원 추가](https://youtrack.jetbrains.com/issue/KTOR-1501)
* 🆕 Ktor: [백엔드 애플리케이션에 대한 프로젝트 구조화 단순화](https://youtrack.jetbrains.com/issue/KTOR-7158)
* 🆕 Ktor: [CLI 생성기를 SNAP에 게시](https://youtrack.jetbrains.com/issue/KTOR-3937)
* 🆕 Ktor: [Kubernetes Generator Plugin 생성](https://youtrack.jetbrains.com/issue/KTOR-6026)
* 🆕 Ktor: [Dependency Injection 사용법 간소화](https://youtrack.jetbrains.com/issue/KTOR-6621)
* 🆕 Ktor: [HTTP/3 지원](https://youtrack.jetbrains.com/issue/KTOR-7938)
* 🆕 Exposed: [릴리스 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* 🆕 Exposed: [R2DBC 지원 추가](https://youtrack.jetbrains.com/issue/EXPOSED-74)

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

이전에 식별된 다른 모든 로드맵 항목은 진행 중입니다. 업데이트는 해당 [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)에서 확인할 수 있습니다.