[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)

<primary-label ref="eap"/>

<web-summary>Kotlin EAP(Early Access Preview) 릴리스 노트를 읽고 최신 실험적 Kotlin 기능을 공식 출시 전에 미리 사용해 보세요.</web-summary>

_[출시일: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 EAP(Early Access Preview) 릴리스의 모든 기능을 다루지는 않지만, 주요 개선 사항을 중점적으로 설명합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)에서 확인하세요.
>
{style="note"}

Kotlin %kotlinEapVersion% 버전이 출시되었습니다! 이번 EAP 릴리스의 주요 내용은 다음과 같습니다:

* **Kotlin 컴파일러 플러그인**: [Lombok Alpha 단계 진입](#lombok-is-now-alpha) 및 [`kotlin.plugin.jpa` 플러그인의 JPA 지원 개선](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Kotlin/Native**: [C 및 Objective-C 라이브러리를 위한 새로운 상호 운용성 모드](#kotlin-native-new-interoperability-mode-for-c-or-objective-c-libraries)
* **Gradle**: [Gradle 9.3.0과의 호환성](#compatibility-with-gradle-9-3-0) 및 [Kotlin/JVM 컴파일에 BTA 기본 사용](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**: [Kotlin 프로젝트 설정 간소화](#maven-simplified-setup-for-kotlin-projects)
* **표준 라이브러리**: [`Map.Entry`의 불변 복사본 생성을 위한 새로운 API](#standard-library-new-api-for-creating-immutable-copies-of-map-entry)

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

%kotlinEapVersion%을 지원하는 Kotlin 플러그인은 최신 버전의 IntelliJ IDEA 및 Android Studio에 포함되어 있습니다.
IDE에서 Kotlin 플러그인을 별도로 업데이트할 필요가 없습니다.
빌드 스크립트에서 [Kotlin 버전만 %kotlinEapVersion%으로 변경](configure-build-for-eap.md)하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## Kotlin 컴파일러 플러그인

Kotlin %kotlinEapVersion%은 Lombok 및 `kotlin.plugin.jpa` 컴파일러 플러그인에 중요한 업데이트를 제공합니다.

### Lombok Alpha 단계 진입
<primary-label ref="alpha"/>

Kotlin 1.5.20에서는 실험적인 [Lombok 컴파일러 플러그인](lombok.md)이 도입되어, Kotlin과 Java 코드가 섞인 모듈에서 [Java의 Lombok 선언](https://projectlombok.org/)을 생성하고 사용할 수 있게 되었습니다.

%kotlinEapVersion%에서 Lombok 컴파일러 플러그인은 [Alpha](components-stability.md#stability-levels-explained) 단계로 격상되었습니다. 이는 해당 기능을 정식 제품화할 계획이지만 여전히 개발 중임을 의미합니다.

### `kotlin.plugin.jpa` 플러그인의 JPA 지원 개선

이제 `kotlin.plugin.jpa` 플러그인은 기존의 [`no-arg`](no-arg-plugin.md) 지원과 더불어, 새로 추가된 기본 제공 JPA 프리셋과 함께 [`all-open`](all-open-plugin.md) 컴파일러 플러그인을 자동으로 적용합니다.

이전에는 `kotlin("plugin.jpa")`를 사용하면 JPA 프리셋이 적용된 `no-arg` 플러그인만 활성화되었습니다. 따라서 JPA 엔티티를 사용할 때는 JPA 엔티티 클래스를 `open`으로 만들기 위해 `all-open` 플러그인을 명시적으로 적용하고 설정해야 했습니다.

Kotlin %kotlinEapVersion%부터는 다음과 같은 변경 사항이 적용됩니다:

* `all-open` 컴파일러 플러그인이 JPA 프리셋을 제공합니다.
* Gradle `org.jetbrains.kotlin.plugin.jpa` 플러그인이 JPA 프리셋이 활성화된 `org.jetbrains.kotlin.plugin.all-open` 플러그인을 자동으로 적용합니다.
* [Maven JPA 설정](no-arg-plugin.md#jpa-support) 시 기본적으로 JPA 프리셋이 포함된 `all-open`이 활성화됩니다.
* Maven 의존성 `org.jetbrains.kotlin:kotlin-maven-noarg`에 `org.jetbrains.kotlin:kotlin-maven-allopen`이 암시적으로 포함되므로, 더 이상 `<plugin><dependencies>` 블록에 명시적으로 추가할 필요가 없습니다.

결과적으로, 다음 어노테이션이 지정된 JPA 엔티티는 별도의 추가 설정 없이도 자동으로 `open`으로 처리되며 인자가 없는 생성자(no-argument constructor)를 갖게 됩니다.

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

이러한 변경을 통해 빌드 구성이 간소화되고, JPA 프레임워크와 함께 Kotlin을 사용할 때의 초기 사용 경험(out-of-the-box experience)이 개선됩니다.

## Kotlin/Native: C 및 Objective-C 라이브러리를 위한 새로운 상호 운용성 모드
<primary-label ref="experimental-opt-in"/>

Kotlin Multiplatform 라이브러리 또는 애플리케이션에서 C 또는 Objective-C 라이브러리를 사용하는 경우, 새로운 상호 운용성(interoperability) 모드를 테스트하고 결과를 공유해 주시기 바랍니다.

일반적으로 Kotlin/Native를 사용하면 C 및 Objective-C 라이브러리를 Kotlin으로 가져올 수 있습니다. 그러나 Kotlin Multiplatform 라이브러리의 경우, 현재 이 기능은 이전 컴파일러 버전과의 KMP 호환성 [이슈](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)로 인해 영향을 받고 있습니다.

즉, 특정 Kotlin 버전으로 컴파일된 Kotlin Multiplatform 라이브러리를 배포할 경우, C 또는 Objective-C 라이브러리를 가져오는 방식 때문에 이전 버전의 Kotlin을 사용하는 프로젝트에서 해당 라이브러리를 사용하지 못할 수 있습니다.

이 문제와 다른 이슈들을 해결하기 위해 Kotlin 팀은 내부적으로 사용되는 상호 운용성 메커니즘을 수정해 왔습니다. Kotlin 2.3.20-Beta1부터 컴파일러 옵션을 통해 이 새로운 모드를 사용해 볼 수 있습니다.

#### 사용 방법

1. Gradle 빌드 파일에서 `cinterops {}` 블록이나 `pod()` 의존성이 있는지 확인하세요. 이것이 있다면 프로젝트에서 C 또는 Objective-C 라이브러리를 사용 중인 것입니다.
2. 프로젝트가 `2.3.20-Beta1` 이상의 버전을 사용하는지 확인하세요.
3. 동일한 빌드 파일에서 cinterop 도구 호출 시 `-Xccall-mode` 컴파일러 옵션을 추가하세요.

    ```kotlin
    kotlin {
        targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
            compilations.configureEach {
                cinterops.configureEach {
                    extraOpts += listOf("-Xccall-mode", "direct")
                }
            }
        }
    }
    ```

4. 평소와 같이 유닛 테스트나 앱 실행 등을 통해 프로젝트를 빌드하고 테스트하세요.

    `--continue` 옵션을 사용하면 태스크 실패 후에도 Gradle이 계속 실행되도록 하여 한꺼번에 더 많은 문제를 찾을 수 있습니다.

> 새로운 상호 운용성 모드는 아직 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계이므로, 이 모드로 컴파일된 라이브러리를 아직 **배포하지 마십시오**.
>
{style="warning"}

#### 결과 보고

새로운 상호 운용성 모드는 대부분의 경우 기존 방식을 그대로 대체(drop-in replacement)할 수 있도록 설계되었습니다.
향후 이 모드를 기본값으로 활성화할 계획이지만, 이를 위해서는 다음과 같은 이유로 최대한 광범위한 프로젝트에서 제대로 작동하는지 검증이 필요합니다.

* 일부 C 및 Objective-C 선언이 새로운 모드에서 아직 지원되지 않을 수 있습니다(주로 호환성 이슈와 충돌하기 때문). 이에 대한 실제 영향도를 파악하여 향후 단계의 우선순위를 정하고자 합니다.
* 예상치 못한 버그나 고려하지 못한 사항이 있을 수 있습니다. 수많은 기능이 상호작용하는 언어를 테스트하는 것은 쉽지 않으며, 각기 고유한 기능을 가진 언어 간의 상호작용을 테스트하는 것은 더욱 어렵습니다.

실제 프로젝트를 검토하고 까다로운 사례를 식별할 수 있도록 도와주세요.
문제가 발생하든 그렇지 않든, [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-83218)의 댓글로 결과를 공유해 주시기 바랍니다.

## Gradle

Kotlin %kotlinEapVersion%은 최신 버전의 Gradle과 호환되며, Kotlin Gradle 플러그인의 Kotlin/JVM 컴파일 관련 변경 사항을 포함합니다.

### Gradle 9.3.0과의 호환성

Kotlin %kotlinEapVersion%은 Gradle 7.6.3부터 9.3.0 버전까지 완전히 호환됩니다. 최신 Gradle 출시 버전까지도 사용할 수 있습니다. 다만, 최신 버전을 사용할 경우 지원 중단(deprecation) 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

### Kotlin/JVM 컴파일에 빌드 도구 API를 기본으로 사용
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion%에서는 Kotlin Gradle 플러그인의 Kotlin/JVM 컴파일 시 [빌드 도구 API](build-tools-api.md)(BTA)를 기본으로 사용합니다. 내부 컴파일 인프라의 이러한 변경을 통해 Kotlin 컴파일러에 대한 빌드 도구 지원을 더 빠르게 개발할 수 있습니다.

문제가 발생할 경우 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)를 통해 의견을 공유해 주세요.

## Maven: Kotlin 프로젝트 설정 간소화

Kotlin %kotlinEapVersion%을 사용하면 Maven 프로젝트에서 Kotlin을 더 쉽게 설정할 수 있습니다. 이제 Kotlin은 소스 루트(source roots)와 Kotlin 표준 라이브러리의 자동 구성을 지원합니다.

새로운 구성을 사용하면, Maven 빌드 시스템으로 새 Kotlin 프로젝트를 생성하거나 기존 Java Maven 프로젝트에 Kotlin을 도입할 때 POM 빌드 파일에 소스 루트를 수동으로 생성하거나 `kotlin-stdlib` 의존성을 추가할 필요가 없습니다.

### 활성화 방법

`pom.xml` 파일의 Kotlin Maven 플러그인 `<build><plugins>` 섹션에 `<extensions>true</extensions>`를 추가하세요.

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinEapVersion%</version>
             <extensions>true</extensions> <!-- 이 확장을 추가하세요 -->
         </plugin>
    </plugins>
</build>
```

새로운 확장은 자동으로 다음 작업을 수행합니다:

* 기존 Kotlin 또는 Java 소스 루트를 변경하지 않고 `src/main/kotlin` 및 `src/test/kotlin` 디렉토리를 생성합니다.
* `kotlin-stdlib` 의존성이 정의되어 있지 않은 경우 자동으로 추가합니다.

Kotlin 표준 라이브러리의 자동 추가 기능을 사용하지 않으려면 `<properties>` 섹션에 다음을 추가하세요.

```xml
<project>
    <properties>
        <!-- 프로퍼티를 통해 스마트 기본값 비활성화 -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

Kotlin 프로젝트의 Maven 구성에 대한 자세한 내용은 [Maven 프로젝트 구성](maven-configure-project.md)을 참조하세요.

## 표준 라이브러리: `Map.Entry`의 불변 복사본 생성을 위한 새로운 API
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion%은 [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/)의 불변 복사본을 생성하기 위한 `Map.Entry.copy()` 확장 함수를 도입합니다.
이 함수를 사용하면 맵을 수정하기 전에 [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html)에서 얻은 엔트리를 미리 복사하여 재사용할 수 있습니다.

`Map.Entry.copy()`는 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 이를 사용하려면 `@OptIn(ExperimentalStdlibApi::class)` 어노테이션을 사용하거나 컴파일러 옵션 `-opt-in=kotlin.ExperimentalStdlibApi`를 추가해야 합니다.

다음은 가변 맵에서 엔트리를 제거할 때 `Map.Entry.copy()`를 사용하는 예제입니다:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // map = {1=1, 3=3}
}