---
title: "Kotlin 릴리스"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   최신 Kotlin 버전: <strong>2.1.20</strong>
</p>
<p>
   자세한 내용은 <a href="whatsnew2120.md">Kotlin 2.1.20의 새로운 기능</a>을 참조하세요.
</p>

:::

Kotlin 2.0.0부터 다음과 같은 유형의 릴리스를 제공합니다.

* _언어 릴리스_ (2._x_._0_): 언어에 주요 변경 사항을 적용하고 도구 업데이트를 포함합니다. 6개월에 한 번 릴리스됩니다.
* _도구 릴리스_ (2._x_._20_): 언어 릴리스 사이에 제공되며 도구 업데이트, 성능 개선 및 버그 수정이 포함됩니다.
    해당 _언어 릴리스_ 후 3개월 후에 릴리스됩니다.
* _버그 수정 릴리스_ (2._x_._yz_): _도구 릴리스_에 대한 버그 수정이 포함됩니다. 이러한 릴리스에 대한 정확한 릴리스 일정은 없습니다.

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

각 언어 및 도구 릴리스마다 릴리스되기 전에 새로운 기능을 사용해 볼 수 있도록 여러 프리뷰(_EAP_) 버전을 제공합니다. 자세한 내용은 [Early Access Preview](eap)를 참조하세요.

:::note
새로운 Kotlin 릴리스에 대한 알림을 받으려면 [Kotlin 뉴스레터](https://lp.jetbrains.com/subscribe-to-kotlin-news/)를 구독하거나, [X의 Kotlin](https://x.com/kotlin)을 팔로우하거나, [Kotlin GitHub 저장소](https://github.com/JetBrains/kotlin)에서 **Watch | Custom | Releases** 옵션을 활성화하세요.

:::

## 새 Kotlin 버전으로 업데이트

프로젝트를 새 릴리스로 업그레이드하려면 빌드 스크립트 파일을 업데이트해야 합니다. 예를 들어 Kotlin 2.1.20으로 업데이트하려면 `build.gradle(.kts)` 파일에서 Kotlin Gradle 플러그인의 버전을 변경하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "2.1.20"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "2.1.20"
    // If your target is Kotlin Multiplatform:
    // kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
    // If your target is Kotlin Multiplatform:
    // id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

이전 Kotlin 버전으로 생성된 프로젝트가 있는 경우 프로젝트에서 Kotlin 버전을 변경하고 필요한 경우 kotlinx 라이브러리를 업데이트합니다.

새 언어 릴리스로 마이그레이션하는 경우 Kotlin 플러그인의 마이그레이션 도구가 마이그레이션을 도와줍니다.

## IDE 지원

K2 컴파일러가 릴리스되었더라도 IntelliJ IDEA 및 Android Studio는 코드 분석, 코드 완성, 강조 표시 및 기타 IDE 관련 기능에 대해 여전히 이전 컴파일러를 기본적으로 사용합니다.

2024.1부터 IntelliJ IDEA는 K2 모드를 사용하여 새 K2 컴파일러로 코드를 분석할 수 있습니다.
활성화하려면 **Settings** | **Languages & Frameworks** | **Kotlin**으로 이동하여 **Enable K2 mode** 옵션을 선택합니다.

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

K2 모드를 활성화한 후 컴파일러 동작의 변경으로 인해 IDE 분석에서 차이점을 발견할 수 있습니다.
새로운 K2 컴파일러가 이전 컴파일러와 어떻게 다른지 [마이그레이션 가이드](k2-compiler-migration-guide)에서 알아보세요.

## Kotlin 릴리스 호환성

[Kotlin 릴리스 유형 및 호환성](kotlin-evolution-principles#language-and-tooling-releases)에 대해 자세히 알아보세요.

## 릴리스 세부 정보

다음 표에는 최신 Kotlin 릴리스에 대한 세부 정보가 나와 있습니다.

:::tip
[Kotlin의 Early Access Preview (EAP) 버전](eap#build-details)을 사용해 볼 수도 있습니다.

:::
<table>
<tr>
        <th>빌드 정보</th>
        <th>빌드 하이라이트</th>
</tr>
<tr>
<td>
<strong>2.1.20</strong>
<p>
   릴리스 날짜: <strong>2025년 3월 20일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   새로운 실험적 기능, 성능 개선 및 버그 수정이 포함된 Kotlin 2.1.0용 도구 릴리스입니다.
</p>
<p>
   Kotlin 2.1.20에 대한 자세한 내용은 <a href="whatsnew2120" target="_blank">Kotlin 2.1.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.10</strong>
<p>
   릴리스 날짜: <strong>2025년 1월 27일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 2.1.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">변경 로그</a>를 참조하세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.1.0</strong>
<p>
   릴리스 날짜: <strong>2024년 11월 27일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   새로운 언어 기능을 도입하는 언어 릴리스입니다.
</p>
<p>
   Kotlin 2.1.0에 대한 자세한 내용은 <a href="whatsnew21" target="_blank">Kotlin 2.1.0의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.21</strong>
<p>
   릴리스 날짜: <strong>2024년 10월 10일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">변경 로그</a>를 참조하세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.20</strong>
<p>
   릴리스 날짜: <strong>2024년 8월 22일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   성능 개선 및 버그 수정이 포함된 Kotlin 2.0.0용 도구 릴리스입니다. 기능에는 Kotlin/Native의 가비지 컬렉터에서 동시 마킹, Kotlin 공통 표준 라이브러리의 UUID 지원, Compose 컴파일러 업데이트 및 최대 Gradle 8.8 지원도 포함됩니다.
</p>
<p>
   Kotlin 2.0.20에 대한 자세한 내용은 <a href="whatsnew2020" target="_blank">Kotlin 2.0.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.10</strong>
<p>
   릴리스 날짜: <strong>2024년 8월 6일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 2.0.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 2.0.0에 대한 자세한 내용은 <a href="whatsnew20" target="_blank">Kotlin 2.0.0의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>2.0.0</strong>
<p>
   릴리스 날짜: <strong>2024년 5월 21일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Stable Kotlin K2 컴파일러가 포함된 언어 릴리스입니다.
</p>
<p>
   Kotlin 2.0.0에 대한 자세한 내용은 <a href="whatsnew20" target="_blank">Kotlin 2.0.0의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.25</strong>
<p>
   릴리스 날짜: <strong>2024년 7월 19일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20, 1.9.21, 1.9.22, 1.9.23 및 1.9.24에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.24</strong>
<p>
   릴리스 날짜: <strong>2024년 5월 7일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20, 1.9.21, 1.9.22 및 1.9.23에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.23</strong>
<p>
   릴리스 날짜: <strong>2024년 3월 7일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20, 1.9.21 및 1.9.22에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.22</strong>
<p>
   릴리스 날짜: <strong>2023년 12월 21일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20 및 1.9.21에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.21</strong>
<p>
   릴리스 날짜: <strong>2023년 11월 23일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.9.20</strong>
<p>
   릴리스 날짜: <strong>2023년 11월 1일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   베타 버전의 Kotlin K2 컴파일러 및 Stable Kotlin Multiplatform이 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew1920" target="_blank">Kotlin 1.9.20의 새로운 기능</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.9.10</strong>
<p>
   릴리스 날짜: <strong>2023년 8월 23일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.9.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.9.0에 대한 자세한 내용은 <a href="whatsnew19" target="_blank">Kotlin 1.9.0의 새로운 기능</a>에서 알아보세요.
</p>
            <note>Android Studio Giraffe 및 Hedgehog의 경우 Kotlin 플러그인 1.9.10은 곧 출시될 Android Studios 업데이트와 함께 제공됩니다.</note>
</td>
</tr>
<tr>
<td>
<strong>1.9.0</strong>
<p>
   릴리스 날짜: <strong>2023년 7월 6일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin K2 컴파일러 업데이트, 새로운 enum 클래스 values 함수,
                개방형 범위에 대한 새로운 연산자, Kotlin Multiplatform의 Gradle 구성 캐시 미리보기,
                Kotlin Multiplatform의 Android 대상 지원 변경, Kotlin/Native의 사용자 지정 메모리 할당자 미리보기가 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew19" target="_blank">Kotlin 1.9.0의 새로운 기능</a></li>
<li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin YouTube 비디오의 새로운 기능</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.22</strong>
<p>
   릴리스 날짜: <strong>2023년 6월 8일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.8.20에 대한 자세한 내용은 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20의 새로운 기능</a>에서 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.8.21</strong>
<p>
   릴리스 날짜: <strong>2023년 4월 25일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.8.20에 대한 자세한 내용은 <a href="whatsnew1820" target="_blank">Kotlin 1.8.20의 새로운 기능</a>에서 알아보세요.
</p>
            <note>Android Studio Flamingo 및 Giraffe의 경우 Kotlin 플러그인 1.8.21은 곧 출시될 Android Studios 업데이트와 함께 제공됩니다.</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.20</strong>
<p>
   릴리스 날짜: <strong>2023년 4월 3일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin K2 컴파일러 업데이트, stdlib의 AutoCloseable 인터페이스 및 Base64 인코딩,
                기본적으로 활성화된 새로운 JVM 증분 컴파일, 새로운 Kotlin/Wasm 컴파일러 백엔드가 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew1820" target="_blank">Kotlin 1.8.20의 새로운 기능</a></li>
<li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin YouTube 비디오의 새로운 기능</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.8.10</strong>
<p>
   릴리스 날짜: <strong>2023년 2월 2일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.8.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>에 대해 자세히 알아보세요.
</p>
            <note>Android Studio Electric Eel 및 Flamingo의 경우 Kotlin 플러그인 1.8.10은 곧 출시될 Android Studios 업데이트와 함께 제공됩니다.</note>
</td>
</tr>
<tr>
<td>
<strong>1.8.0</strong>
<p>
   릴리스 날짜: <strong>2022년 12월 28일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   개선된 kotlin-reflect 성능, JVM에 대한 새로운 재귀적 복사 또는 삭제 디렉터리 콘텐츠 실험적 함수, 개선된 Objective-C/Swift 상호 운용성이 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew18" target="_blank">Kotlin 1.8.0의 새로운 기능</a></li>
<li><a href="compatibility-guide-18" target="_blank">Kotlin 1.8.0에 대한 호환성 가이드</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.7.21</strong>
<p>
   릴리스 날짜: <strong>2022년 11월 9일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   Kotlin 1.7.20에 대한 자세한 내용은 <a href="whatsnew1720" target="_blank">Kotlin 1.7.20의 새로운 기능</a>에서 알아보세요.
</p>
            <note>Android Studio Dolphin, Electric Eel 및 Flamingo의 경우 Kotlin 플러그인 1.7.21은 곧 출시될 Android Studios 업데이트와 함께 제공됩니다.</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.20</strong>
<p>
   릴리스 날짜: <strong>2022년 9월 29일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   새로운 언어 기능, Kotlin K2 컴파일러의 여러 컴파일러 플러그인 지원,
                기본적으로 활성화된 새로운 Kotlin/Native 메모리 관리자 및 Gradle 7.1 지원이 포함된 증분 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew1720" target="_blank">Kotlin 1.7.20의 새로운 기능</a></li>
<li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin YouTube 비디오의 새로운 기능</a></li>
<li><a href="compatibility-guide-1720" target="_blank">Kotlin 1.7.20에 대한 호환성 가이드</a></li>
</list>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.7.10</strong>
<p>
   릴리스 날짜: <strong>2022년 7월 7일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.7.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>에 대해 자세히 알아보세요.
</p>
            <note>Android Studio Dolphin (213) 및 Android Studio Electric Eel (221)의 경우 Kotlin 플러그인 1.7.10은 곧 출시될 Android Studios 업데이트와 함께 제공됩니다.</note>
</td>
</tr>
<tr>
<td>
<strong>1.7.0</strong>
<p>
   릴리스 날짜: <strong>2022년 6월 9일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   JVM용 Alpha 버전의 Kotlin K2 컴파일러, 안정화된 언어 기능, 성능 개선 및 실험적 API 안정화와 같은 진화적 변경 사항이 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="whatsnew17" target="_blank">Kotlin 1.7.0의 새로운 기능</a></li>
<li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin YouTube 비디오의 새로운 기능</a></li>
<li><a href="compatibility-guide-17" target="_blank">Kotlin 1.7.0에 대한 호환성 가이드</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.6.21</strong>
<p>
   릴리스 날짜: <strong>2022년 4월 20일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.20</strong>
<p>
   릴리스 날짜: <strong>2022년 4월 4일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   다음과 같은 다양한 개선 사항이 포함된 증분 릴리스입니다.
</p>
<list>
<li>컨텍스트 수신기 프로토타입</li>
<li>함수형 인터페이스 생성자에 대한 호출 가능 참조</li>
<li>Kotlin/Native: 새로운 메모리 관리자의 성능 개선</li>
<li>Multiplatform: 기본적으로 계층적 프로젝트 구조</li>
<li>Kotlin/JS: IR 컴파일러 개선</li>
<li>Gradle: 컴파일러 실행 전략</li>
</list>
<p>
   <a href="whatsnew1620" target="_blank">Kotlin 1.6.20</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.10</strong>
<p>
   릴리스 날짜: <strong>2021년 12월 14일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.6.0에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.6.0</strong>
<p>
   릴리스 날짜: <strong>2021년 11월 16일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   새로운 언어 기능, 성능 개선 및 실험적 API 안정화와 같은 진화적 변경 사항이 포함된 기능 릴리스입니다.
</p>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">릴리스 블로그 게시물</a></li>
<li><a href="whatsnew16" target="_blank">Kotlin 1.6.0의 새로운 기능</a></li>
<li><a href="compatibility-guide-16" target="_blank">호환성 가이드</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.32</strong>
<p>
   릴리스 날짜: <strong>2021년 11월 29일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.31에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.31</strong>
<p>
   릴리스 날짜: <strong>2021년 9월 20일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.30에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="whatsnew1530" target="_blank">Kotlin 1.5.30</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.30</strong>
<p>
   릴리스 날짜: <strong>2021년 8월 23일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   다음과 같은 다양한 개선 사항이 포함된 증분 릴리스입니다.
</p>
<list>
<li>JVM에서 어노테이션 클래스 인스턴스화</li>
<li>개선된 옵트인 요구 사항 메커니즘 및 유형 추론</li>
<li>베타 버전의 Kotlin/JS IR 백엔드</li>
<li>Apple Silicon 대상 지원</li>
<li>개선된 CocoaPods 지원</li>
<li>Gradle: Java 도구 체인 지원 및 개선된 데몬 구성</li>
</list>
<p>
   자세한 내용은 다음을 참조하세요.
</p>
<list>
<li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">릴리스 블로그 게시물</a></li>
<li><a href="whatsnew1530" target="_blank">Kotlin 1.5.30의 새로운 기능</a></li>
</list>
</td>
</tr>
<tr>
<td>
<strong>1.5.21</strong>
<p>
   릴리스 날짜: <strong>2021년 7월 13일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   Kotlin 1.5.20에 대한 버그 수정 릴리스입니다.
</p>
<p>
   <a href="whatsnew1520" target="_blank">Kotlin 1.5.20</a>에 대해 자세히 알아보세요.
</p>
</td>
</tr>
<tr>
<td>
<strong>1.5.20</strong>
<p>
   릴리스 날짜: <strong>2021년 6월 24일</strong>
</p>
<p>
   <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub의 릴리스</a>
</p>
</td>
<td>

<p>
   다음과 같은 다양한 개선 사항이 포함된 증분 릴리스입니다.
</p>
<list>
<li>기본적으로 JVM에서 `invokedynamic`을 통한 문자열 연결</li>
<li>Lombok에 대한 개선된 지원 및 JSpecify 지원</li>
<li>Kotlin/Native</li>
</list>
</td>
</tr>
</table>