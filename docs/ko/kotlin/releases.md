[//]: # (title: Kotlin 릴리스)

<tldr>
    <p>최신 Kotlin 버전: **%kotlinVersion%**</p>
    <p><a href="%kotlinLatestWhatsnew%">Kotlin 2.2.20의 새로운 기능</a>을 참조하세요. <!--and find the bug fix details in the <a href="%kotlinLatestUrl%">changelog</a>-->.</p>
</tldr>

Kotlin 2.0.0부터 다음과 같은 유형의 릴리스를 제공합니다.

*   _언어 릴리스_ (2._x_._0_): 언어의 주요 변경 사항과 툴링 업데이트를 포함합니다. 6개월에 한 번 릴리스됩니다.
*   _툴링 릴리스_ (2._x_._20_): 언어 릴리스 사이에 제공되며 툴링 업데이트, 성능 개선 및 버그 수정을 포함합니다. 해당 _언어 릴리스_ 후 3개월 이내에 릴리스됩니다.
*   _버그 수정 릴리스_ (2._x_._yz_): _툴링 릴리스_의 버그 수정을 포함합니다. 이러한 릴리스에 대한 정확한 릴리스 일정은 없습니다.

<!-- TODO: uncomment with 2.1.0 release
> For example, for the feature release 1.8.0, we had only one tooling release 1.8.20,
> and several bugfix releases including 1.8.21, 1.8.22.
>
{style="tip"}
-->

각 언어 및 툴링 릴리스에 대해, 릴리스되기 전에 새로운 기능을 미리 사용해 볼 수 있도록 여러 미리보기 (_EAP_) 버전도 함께 제공합니다. 자세한 내용은 [얼리 액세스 프리뷰](eap.md)를 참조하세요.

> 새로운 Kotlin 릴리스에 대한 알림을 받고 싶다면, [Kotlin 뉴스레터](https://lp.jetbrains.com/subscribe-to-kotlin-news/)를 구독하거나, [X의 Kotlin](https://x.com/kotlin)을 팔로우하거나, [Kotlin GitHub 저장소](https://github.com/JetBrains/kotlin)에서 **Watch | Custom | Releases** 옵션을 활성화하세요.
> 
{style="note"}

## 예정된 Kotlin 릴리스

예정된 안정적인 Kotlin 릴리스에 대한 대략적인 일정은 다음과 같습니다.

*   **2.3.0**: 2025년 12월 – 2026년 1월 예정
*   **2.3.20**: 2026년 3월 – 4월 예정

## 새 Kotlin 버전으로 업데이트

프로젝트를 새 릴리스로 업그레이드하려면 빌드 시스템에서 Kotlin 버전을 업데이트하세요.

### Gradle

Kotlin %kotlinVersion%으로 업데이트하려면 `build.gradle(.kts)` 파일에서 Kotlin Gradle 플러그인 버전을 변경하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // <...>를 타겟 환경에 적합한 플러그인 이름으로 바꾸세요
    kotlin("<...>") version "%kotlinVersion%"
    // 예를 들어, 타겟 환경이 JVM인 경우:
    // kotlin("jvm") version "%kotlinVersion%"
    // 타겟이 Kotlin Multiplatform인 경우:
    // kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // <...>를 타겟 환경에 적합한 플러그인 이름으로 바꾸세요
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // 예를 들어, 타겟 환경이 JVM인 경우: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    // 타겟이 Kotlin Multiplatform인 경우:
    // id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

이전 Kotlin 버전으로 생성된 프로젝트가 있는 경우, [kotlinx 라이브러리 버전도 업데이트](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)해야 하는지 확인하세요.

새 언어 릴리스로 마이그레이션하는 경우, Kotlin 플러그인의 마이그레이션 도구가 프로세스를 도와줄 것입니다.

> 프로젝트에서 Gradle을 사용하는 방법에 대해 자세히 알아보려면 [Gradle 프로젝트 구성하기](gradle-configure-project.md)를 참조하세요.
> 
{style="tip"}

### Maven

Kotlin %kotlinVersion%으로 업데이트하려면 `pom.xml` 파일에서 버전을 변경하세요.

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

또는 `pom.xml` 파일에서 `kotlin-maven-plugin` 버전을 변경할 수 있습니다.

```xml
<plugins>
    <plugin>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-plugin</artifactId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

이전 Kotlin 버전으로 생성된 프로젝트가 있는 경우, [kotlinx 라이브러리 버전도 업데이트](maven.md#dependency-on-a-kotlinx-library)해야 하는지 확인하세요.

> 프로젝트에서 Maven을 사용하는 방법에 대해 자세히 알아보려면 [Maven](maven.md)을 참조하세요.
>
{style="tip"}

## IDE 지원

Kotlin은 JetBrains에서 개발한 공식 Kotlin 플러그인과 함께 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/kotlin/get-started)에서 완전한 즉시 사용 가능한 지원을 제공합니다.

IntelliJ IDEA 및 Android Studio의 K2 모드는 K2 컴파일러를 사용하여 코드 분석, 코드 완성 및 하이라이팅을 개선합니다.

IntelliJ IDEA 2025.1부터 K2 모드는 [기본적으로 활성화됩니다](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/).

Android Studio에서는 2024.1부터 다음 단계에 따라 K2 모드를 활성화할 수 있습니다.

1.  **설정** | **언어 및 프레임워크** | **Kotlin**으로 이동합니다.
2.  **K2 모드 활성화** 옵션을 선택합니다.

K2 모드에 대한 자세한 내용은 [저희 블로그](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)에서 확인하세요.

## Kotlin 릴리스 호환성

[Kotlin 릴리스 유형 및 호환성](kotlin-evolution-principles.md#language-and-tooling-releases)에 대해 자세히 알아보세요.

## 릴리스 세부 정보

다음 표에는 최신 Kotlin 릴리스의 세부 정보가 나와 있습니다.

> [Kotlin의 얼리 액세스 프리뷰(EAP) 버전](eap.md#build-details)도 사용해 볼 수 있습니다.
> 
{style="tip"}

<table>
    <tr>
        <th>빌드 정보</th>
        <th>빌드 하이라이트</th>
    </tr>
    <tr>
        <td>**2.2.21**
            <p>릴리스됨: **October 23, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Xcode 26 지원 및 기타 개선 사항과 버그 수정을 포함하는 툴링 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">변경 로그</a>를 참조하세요.</p>
    </td>
    </tr>
    <tr>
        <td>**2.2.20**
            <p>릴리스됨: **September 10, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>웹 개발을 위한 중요한 변경 사항 및 기타 개선 사항을 포함하는 Kotlin 2.2.0의 툴링 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.20">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.2.10**
            <p>릴리스됨: **August 14, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 2.2.0의 버그 수정 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.10">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.2.0**
            <p>릴리스됨: **June 23, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>새롭고 안정화된 언어 기능, 툴링 업데이트, 다양한 플랫폼에 대한 성능 개선, 그리고 중요한 수정 사항을 포함하는 언어 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.0">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr> 
    <tr>
        <td>**2.1.21**
            <p>릴리스됨: **May 13, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.20의 버그 수정 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.21">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr> 
   <tr>
        <td>**2.1.20**
            <p>릴리스됨: **March 20, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
           <p>새로운 실험적 기능, 성능 개선 및 버그 수정을 포함하는 Kotlin 2.1.0의 툴링 릴리스입니다.</p>
            <p>Kotlin 2.1.20에 대한 자세한 내용은 <a href="whatsnew2120.md" target="_blank">Kotlin 2.1.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.1.10**
            <p>릴리스됨: **January 27, 2025**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 2.1.0의 버그 수정 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.10">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.1.0**
            <p>릴리스됨: **November 27, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.1.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>새로운 언어 기능을 소개하는 언어 릴리스입니다.</p>
            <p>Kotlin 2.1.0에 대한 자세한 내용은 <a href="whatsnew21.md" target="_blank">Kotlin 2.1.0의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.0.21**
            <p>릴리스됨: **October 10, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.20의 버그 수정 릴리스입니다.</p>
            <p>자세한 내용은 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.21">변경 로그</a>를 참조하세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.0.20**
            <p>릴리스됨: **August 22, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
           <p>성능 개선 및 버그 수정을 포함하는 Kotlin 2.0.0의 툴링 릴리스입니다. Kotlin/Native 가비지 컬렉터의 동시 마킹, Kotlin 공통 표준 라이브러리의 UUID 지원, Compose 컴파일러 업데이트, Gradle 8.8까지의 지원 기능도 포함됩니다.
            </p>
            <p>Kotlin 2.0.20에 대한 자세한 내용은 <a href="whatsnew2020.md" target="_blank">Kotlin 2.0.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.0.10**
            <p>릴리스됨: **August 6, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 2.0.0의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 2.0.0에 대한 자세한 내용은 <a href="whatsnew20.md" target="_blank">Kotlin 2.0.0의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**2.0.0**
            <p>릴리스됨: **May 21, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v2.0.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>안정적인 Kotlin K2 컴파일러를 포함하는 언어 릴리스입니다.</p>
            <p>Kotlin 2.0.0에 대한 자세한 내용은 <a href="whatsnew20.md" target="_blank">Kotlin 2.0.0의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.25**
            <p>릴리스됨: **July 19, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.25" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20, 1.9.21, 1.9.22, 1.9.23 및 1.9.24의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.24**
            <p>릴리스됨: **May 7, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.24" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20, 1.9.21, 1.9.22 및 1.9.23의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.23**
            <p>릴리스됨: **March 7, 2024**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20, 1.9.21 및 1.9.22의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.22**
            <p>릴리스됨: **December 21, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20 및 1.9.21의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.21**
            <p>릴리스됨: **November 23, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.20의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.20에 대한 자세한 내용은 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.9.20**
            <p>릴리스됨: **November 1, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>베타 버전의 Kotlin K2 컴파일러와 안정적인 Kotlin 멀티플랫폼을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.9.10**
            <p>릴리스됨: **August 23, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.9.0의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.9.0에 대한 자세한 내용은 <a href="whatsnew19.md" target="_blank">Kotlin 1.9.0의 새로운 기능</a>에서 알아보세요.</p>
            <note>Android Studio Giraffe 및 Hedgehog의 경우, Kotlin 플러그인 1.9.10은 향후 Android Studio 업데이트와 함께 제공됩니다.</note>
        </td>
    </tr>
    <tr>
        <td>**1.9.0**
            <p>릴리스됨: **July 6, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin K2 컴파일러 업데이트, 새로운 enum 클래스 값 함수, 개방형 범위용 새 연산자, Kotlin 멀티플랫폼의 Gradle 설정 캐시 미리보기, Kotlin 멀티플랫폼의 Android 대상 지원 변경 사항, Kotlin/Native의 사용자 정의 메모리 할당자 미리보기를 포함하는 기능 릴리스입니다.
            </p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0의 새로운 기능</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">Kotlin YouTube 동영상의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.8.22**
            <p>릴리스됨: **June 8, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.8.20에 대한 자세한 내용은 <a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20의 새로운 기능</a>에서 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.8.21**
            <p>릴리스됨: **April 25, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.20의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.8.20에 대한 자세한 내용은 <a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20의 새로운 기능</a>에서 알아보세요.</p>
            <note>Android Studio Flamingo 및 Giraffe의 경우, Kotlin 플러그인 1.8.21은 향후 Android Studio 업데이트와 함께 제공됩니다.</note>
        </td>
    </tr>
    <tr>
        <td>**1.8.20**
            <p>릴리스됨: **April 3, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin K2 컴파일러 업데이트, stdlib의 AutoCloseable 인터페이스 및 Base64 인코딩, 기본적으로 활성화된 새로운 JVM 증분 컴파일, 새로운 Kotlin/Wasm 컴파일러 백엔드를 포함하는 기능 릴리스입니다.
            </p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20의 새로운 기능</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">Kotlin YouTube 동영상의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.8.10**
            <p>릴리스됨: **February 2, 2023**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.8.0의 버그 수정 릴리스입니다.</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>에 대해 자세히 알아보세요.</p>
            <note>Android Studio Electric Eel 및 Flamingo의 경우, Kotlin 플러그인 1.8.10은 향후 Android Studio 업데이트와 함께 제공됩니다.</note>
        </td>
    </tr>
    <tr>
        <td>**1.8.0**
            <p>릴리스됨: **December 28, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>향상된 kotlin-reflect 성능, JVM용 새로운 재귀적 디렉터리 콘텐츠 복사 또는 삭제 실험적 함수, 개선된 Objective-C/Swift 상호 운용성을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0의 새로운 기능</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8.0 호환성 가이드</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.7.21**
            <p>릴리스됨: **November 9, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.20의 버그 수정 릴리스입니다.</p>
            <p>Kotlin 1.7.20에 대한 자세한 내용은 <a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20의 새로운 기능</a>에서 알아보세요.</p>
            <note>Android Studio Dolphin, Electric Eel 및 Flamingo의 경우, Kotlin 플러그인 1.7.21은 향후 Android Studio 업데이트와 함께 제공됩니다.</note>
        </td>
    </tr>
    <tr>
        <td>**1.7.20**
            <p>릴리스됨: **September 29, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>새로운 언어 기능, Kotlin K2 컴파일러의 여러 컴파일러 플러그인 지원, 기본적으로 활성화된 새로운 Kotlin/Native 메모리 관리자, Gradle 7.1 지원을 포함하는 점진적 릴리스입니다.
            </p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20의 새로운 기능</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">Kotlin YouTube 동영상의 새로운 기능</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20 호환성 가이드</a></li>
            </list>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.7.10**
            <p>릴리스됨: **July 7, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.7.0의 버그 수정 릴리스입니다.</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>에 대해 자세히 알아보세요.</p>
            <note>Android Studio Dolphin (213) 및 Android Studio Electric Eel (221)의 경우, Kotlin 플러그인 1.7.10은 향후 Android Studio 업데이트와 함께 제공됩니다.</note>
        </td>
    </tr>
    <tr>
        <td>**1.7.0**
            <p>릴리스됨: **June 9, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>JVM용 Kotlin K2 컴파일러의 알파 버전, 안정화된 언어 기능, 성능 개선 및 실험적 API 안정화와 같은 점진적인 변경 사항을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0의 새로운 기능</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">Kotlin YouTube 동영상의 새로운 기능</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0 호환성 가이드</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.6.21**
            <p>릴리스됨: **April 20, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.20의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.6.20**
            <p>릴리스됨: **April 4, 2022**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>다음과 같은 다양한 개선 사항을 포함하는 점진적 릴리스입니다:</p>
            <list>
                <li>컨텍스트 리시버 프로토타입</li>
                <li>함수형 인터페이스 생성자에 대한 호출 가능 참조</li>
                <li>Kotlin/Native: 새로운 메모리 관리자 성능 개선</li>
                <li>멀티플랫폼: 기본 계층적 프로젝트 구조</li>
                <li>Kotlin/JS: IR 컴파일러 개선 사항</li>
                <li>Gradle: 컴파일러 실행 전략</li>
            </list>
            <p><a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.6.10**
            <p>릴리스됨: **December 14, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.6.0의 버그 수정 릴리스입니다.</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.6.0**
            <p>릴리스됨: **November 16, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>새로운 언어 기능, 성능 개선, 실험적 API 안정화와 같은 점진적인 변경 사항을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0의 새로운 기능</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">호환성 가이드</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.5.32**
            <p>릴리스됨: **November 29, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.31의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.5.31**
            <p>릴리스됨: **September 20, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.30의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.5.30**
            <p>릴리스됨: **August 23, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>다음과 같은 다양한 개선 사항을 포함하는 점진적 릴리스입니다:</p>
            <list>
                <li>JVM에서 어노테이션 클래스 인스턴스화</li>
                <li>개선된 옵트인 요구 사항 메커니즘 및 타입 추론</li>
                <li>베타 버전의 Kotlin/JS IR 백엔드</li>
                <li>Apple Silicon 대상 지원</li>
                <li>개선된 CocoaPods 지원</li>
                <li>Gradle: Java 툴체인 지원 및 개선된 데몬 구성</li>
            </list>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.5.21**
            <p>릴리스됨: **July 13, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.20의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.5.20**
            <p>릴리스됨: **June 24, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>다음과 같은 다양한 개선 사항을 포함하는 점진적 릴리스입니다:</p>
            <list>
                <li>JVM에서 기본적으로 `invokedynamic`을 통한 문자열 연결</li>
                <li>Lombok 지원 개선 및 JSpecify 지원</li>
                <li>Kotlin/Native: Objective-C 헤더로 KDoc 내보내기 및 단일 배열 내에서 더 빠른 `Array.copyInto()`</li>
                <li>Gradle: 어노테이션 프로세서 클래스로더 캐싱 및 `--parallel` Gradle 속성 지원</li>
                <li>플랫폼 전반에 걸쳐 stdlib 함수 동작 일치</li>
            </list>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.5.10**
            <p>릴리스됨: **May 24, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.5.0의 버그 수정 릴리스입니다.</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.5.0**
            <p>릴리스됨: **May 5, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>새로운 언어 기능, 성능 개선, 실험적 API 안정화와 같은 점진적인 변경 사항을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0의 새로운 기능</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">호환성 가이드</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.4.32**
            <p>릴리스됨: **March 22, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.4.31**
            <p>릴리스됨: **February 25, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.30의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.4.30**
            <p>릴리스됨: **February 3, 2021**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>다음과 같은 다양한 개선 사항을 포함하는 점진적 릴리스입니다:</p>
            <list>
                <li>새로운 JVM 백엔드, 현재 베타 버전</li>
                <li>새로운 언어 기능 미리보기</li>
                <li>Kotlin/Native 성능 향상</li>
                <li>표준 라이브러리 API 개선 사항</li>
            </list>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.4.21**
            <p>릴리스됨: **December 7, 2020**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.20의 버그 수정 릴리스입니다.</p>
            <p><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>**1.4.20**
            <p>릴리스됨: **November 23, 2020**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>다음과 같은 다양한 개선 사항을 포함하는 점진적 릴리스입니다:</p>
            <list>
                <li>`invokedynamic`을 통한 문자열 연결과 같은 새로운 JVM 기능 지원</li>
                <li>Kotlin 멀티플랫폼 모바일 프로젝트의 성능 및 예외 처리 개선</li>
                <li>JDK `Path` 확장: `Path("dir") / "file.txt"`</li>
            </list>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20의 새로운 기능</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.4.10**
            <p>릴리스됨: **September 7, 2020**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.4.0의 버그 수정 릴리스입니다.</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>에 대해 자세히 알아보세요.</p>
         </td>
    </tr>
    <tr>
        <td>**1.4.0**
            <p> 릴리스됨: **August 17, 2020**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>주로 품질과 성능에 중점을 둔 다양한 기능과 개선 사항을 포함하는 기능 릴리스입니다.</p>
            <p>자세한 내용은 다음을 참조하세요:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">릴리스 블로그 게시물</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0의 새로운 기능</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">호환성 가이드</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">Kotlin 1.4.0으로 마이그레이션</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td>**1.3.72**
            <p> 릴리스됨: **April 15, 2020**</p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHub에서 릴리스</a></p>
        </td>
        <td>
            <p>Kotlin 1.3.70의 버그 수정 릴리스입니다.</p>
            <p><a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>에 대해 자세히 알아보세요.</p>
        </td>
    </tr>
</table>