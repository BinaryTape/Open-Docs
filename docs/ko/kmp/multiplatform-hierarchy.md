[//]: # (title: 계층적 프로젝트 구조)

Kotlin 멀티플랫폼 프로젝트는 계층적 소스 세트 구조를 지원합니다.
이는 일부 [지원되는 타겟](multiplatform-dsl-reference.md#targets) 간에 공통 코드를 공유하되 모든 타겟이 아닌 특정 타겟 간에 공통 코드를 공유하기 위해 중간 소스 세트의 계층을 구성할 수 있음을 의미합니다. 중간 소스 세트를 사용하면 다음을 수행할 수 있습니다.

* 특정 타겟에 대한 API를 제공합니다. 예를 들어, 라이브러리는 Kotlin/Native 타겟을 위한 네이티브별 API를 중간 소스 세트에 추가할 수 있지만, Kotlin/JVM 타겟을 위한 API는 추가하지 않을 수 있습니다.
* 특정 타겟에 대한 API를 사용합니다. 예를 들어, Kotlin 멀티플랫폼 라이브러리가 중간 소스 세트를 구성하는 일부 타겟에 대해 제공하는 풍부한 API를 활용할 수 있습니다.
* 프로젝트에서 플랫폼 종속 라이브러리를 사용합니다. 예를 들어, 중간 iOS 소스 세트에서 iOS별 종속성에 접근할 수 있습니다.

Kotlin 툴체인은 각 소스 세트가 해당 소스 세트가 컴파일되는 모든 타겟에 대해 사용 가능한 API에만 접근할 수 있도록 보장합니다. 이렇게 하면 Windows 특정 API를 사용한 다음 macOS로 컴파일하여 런타임에 링키지 오류 또는 정의되지 않은 동작이 발생하는 경우를 방지할 수 있습니다.

소스 세트 계층을 설정하는 권장 방법은 [기본 계층 템플릿](#default-hierarchy-template)을 사용하는 것입니다.
이 템플릿은 가장 일반적인 경우를 다룹니다. 더 복잡한 프로젝트가 있는 경우, [수동으로 구성](#manual-configuration)할 수 있습니다.
이는 더 저수준의 접근 방식이며, 유연성이 높지만 더 많은 노력과 지식이 필요합니다.

## 기본 계층 템플릿

Kotlin Gradle 플러그인에는 내장된 기본 [계층 템플릿](#see-the-full-hierarchy-template)이 있습니다.
이 템플릿에는 몇 가지 일반적인 사용 사례를 위한 사전 정의된 중간 소스 세트가 포함되어 있습니다.
플러그인은 프로젝트에 지정된 타겟을 기반으로 이러한 소스 세트를 자동으로 설정합니다.

공유 코드가 포함된 프로젝트 모듈의 다음 `build.gradle(.kts)` 파일을 살펴보세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
</tabs>

코드에서 `androidTarget`, `iosArm64`, `iosSimulatorArm64` 타겟을 선언하면 Kotlin Gradle 플러그인은 템플릿에서 적합한 공유 소스 세트를 찾아 생성해 줍니다. 결과적인 계층은 다음과 같습니다.

![An example of using the default hierarchy template](default-hierarchy-example.svg)

색깔이 있는 소스 세트는 실제로 프로젝트에 생성되어 존재하며, 기본 템플릿의 회색 소스 세트는 무시됩니다. 예를 들어, 프로젝트에 watchOS 타겟이 없으므로 Kotlin Gradle 플러그인은 `watchos` 소스 세트를 생성하지 않았습니다.

`watchosArm64`와 같은 watchOS 타겟을 추가하면 `watchos` 소스 세트가 생성되며, `apple`, `native`, `common` 소스 세트의 코드도 `watchosArm64`로 컴파일됩니다.

Kotlin Gradle 플러그인은 기본 계층 템플릿의 모든 소스 세트에 대해 타입-세이프(type-safe) 및 정적 접근자(static accessor)를 모두 제공하므로, [수동 구성](#manual-configuration)과 비교하여 `by getting` 또는 `by creating` 구문 없이도 참조할 수 있습니다.

공유 모듈의 `build.gradle(.kts)` 파일에서 해당 타겟을 먼저 선언하지 않고 소스 세트에 접근하려고 하면 경고가 표시됩니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 경고: 타겟을 선언하지 않고 소스 세트에 접근하고 있습니다.
        linuxX64Main { }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 경고: 타겟을 선언하지 않고 소스 세트에 접근하고 있습니다.
        linuxX64Main { }
    }
}
```

</tab>
</tabs>

> 이 예시에서 `apple` 및 `native` 소스 세트는 `iosArm64` 및 `iosSimulatorArm64` 타겟으로만 컴파일됩니다.
> 이름에도 불구하고, 이들은 전체 iOS API에 접근할 수 있습니다.
> `native`와 같은 소스 세트의 경우 모든 네이티브 타겟에서 사용 가능한 API만 이 소스 세트에서 접근할 수 있다고 예상할 수 있으므로, 이는 직관적이지 않을 수 있습니다. 이러한 동작은 향후 변경될 수 있습니다.
>
{style="note"}

### 추가 구성

기본 계층 템플릿을 조정해야 할 수도 있습니다. 이전에 `dependsOn` 호출을 사용하여 [수동으로](#manual-configuration) 중간 소스를 도입한 경우, 이는 기본 계층 템플릿 사용을 취소하고 다음 경고를 발생시킵니다.

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

이 문제를 해결하려면 다음 중 하나를 수행하여 프로젝트를 구성하십시오.

* [수동 구성을 기본 계층 템플릿으로 교체](#replacing-a-manual-configuration)
* [기본 계층 템플릿에 추가 소스 세트 생성](#creating-additional-source-sets)
* [기본 계층 템플릿으로 생성된 소스 세트 수정](#modifying-source-sets)

#### 수동 구성 교체

**상황**. 모든 중간 소스 세트가 현재 기본 계층 템플릿으로 다루어지는 경우.

**해결책**. 공유 모듈의 `build.gradle(.kts)` 파일에서 모든 수동 `dependsOn()` 호출과 `by creating` 구문을 사용하는 소스 세트를 제거하세요. 모든 기본 소스 세트 목록을 확인하려면 [전체 계층 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

#### 추가 소스 세트 생성

**상황**. 기본 계층 템플릿에서 아직 제공하지 않는 소스 세트(예: macOS 및 JVM 타겟 사이에 있는 소스 세트)를 추가하려는 경우.

**해결책**:

1. 공유 모듈의 `build.gradle(.kts)` 파일에서 `applyDefaultHierarchyTemplate()`을 명시적으로 호출하여 템플릿을 다시 적용합니다.
2. `dependsOn()`을 사용하여 추가 소스 세트를 [수동으로 구성](#manual-configuration)합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 기본 계층을 다시 적용합니다. 이렇게 하면 예를 들어 iosMain 소스 세트가 생성됩니다.
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 추가 jvmAndMacos 소스 세트 생성:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 기본 계층을 다시 적용합니다. 이렇게 하면 예를 들어 iosMain 소스 세트가 생성됩니다.
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 추가 jvmAndMacos 소스 세트 생성:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </tab>
    </tabs>

#### 소스 세트 수정

**상황**. 템플릿으로 생성된 소스 세트와 정확히 동일한 이름을 가진 소스 세트를 이미 가지고 있지만, 프로젝트의 다른 타겟 세트 간에 공유되는 경우. 예를 들어, `nativeMain` 소스 세트가 `linuxX64`, `mingwX64`, `macosX64`와 같은 데스크톱 특정 타겟 간에만 공유되는 경우.

**해결책**. 현재 템플릿의 소스 세트 간에 기본 `dependsOn` 관계를 수정할 방법은 없습니다.
또한 `nativeMain`과 같은 소스 세트의 구현과 의미가 모든 프로젝트에서 동일해야 한다는 점도 중요합니다.

하지만 다음 중 하나를 수행할 수 있습니다.

* 기본 계층 템플릿에 있거나 수동으로 생성된 다른 소스 세트를 찾아 사용 목적에 맞게 활용합니다.
* `gradle.properties` 파일에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하여 템플릿 사용을 완전히 중단하고 모든 소스 세트를 수동으로 구성합니다.

> 현재 자체 계층 템플릿을 생성하는 API를 개발 중입니다. 이는 기본 템플릿과 크게 다른 계층 구성을 가진 프로젝트에 유용할 것입니다.
>
> 이 API는 아직 준비되지 않았지만, 사용해보고 싶다면 `applyHierarchyTemplate {}` 블록과 `KotlinHierarchyTemplate.default` 선언을 예시로 살펴보세요.
> 이 API는 아직 개발 중이므로 테스트되지 않았을 수 있으며 향후 릴리스에서 변경될 수 있음을 유의하십시오.
>
{style="tip"}

#### 전체 계층 템플릿 보기 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트가 컴파일할 타겟을 선언하면,
플러그인은 지정된 타겟을 기반으로 템플릿에서 공유 소스 세트를 선택하여 프로젝트에 생성합니다.

![Default hierarchy template](full-template-hierarchy.svg)

> 이 예시는 프로젝트의 프로덕션 부분만 보여주며, `Main` 접미사가 생략되었습니다(예: `commonMain` 대신 `common` 사용). 하지만 `*Test` 소스에도 모든 것이 동일하게 적용됩니다.
>
{style="tip"}

## 수동 구성

소스 세트 구조에 중간 소스를 수동으로 도입할 수 있습니다.
이는 여러 타겟에 대한 공유 코드를 보유하게 됩니다.

예를 들어, 네이티브 Linux, Windows, macOS 타겟(`linuxX64`, `mingwX64`, `macosX64`) 간에 코드를 공유하려는 경우 다음을 수행합니다.

1. 공유 모듈의 `build.gradle(.kts)` 파일에 이러한 타겟에 대한 공유 로직을 보유하는 중간 소스 세트 `desktopMain`을 추가합니다.
2. `dependsOn` 관계를 사용하여 소스 세트 계층을 설정합니다. `commonMain`을 `desktopMain`에 연결한 다음, `desktopMain`을 각 타겟 소스 세트에 연결합니다.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </tab>
    </tabs>

결과적인 계층 구조는 다음과 같습니다.

![Manually configured hierarchical structure](manual-hierarchical-structure.svg)

다음 타겟 조합에 대해 공유 소스 세트를 가질 수 있습니다.

* JVM 또는 Android + JS + Native
* JVM 또는 Android + Native
* JS + Native
* JVM 또는 Android + JS
* Native

Kotlin은 현재 다음 조합에 대한 소스 세트 공유를 지원하지 않습니다.

* 여러 JVM 타겟
* JVM + Android 타겟
* 여러 JS 타겟

공유 네이티브 소스 세트에서 플랫폼별 API에 접근해야 하는 경우, IntelliJ IDEA가 공유 네이티브 코드에서 사용할 수 있는 공통 선언을 감지하는 데 도움이 될 것입니다.
다른 경우에는 Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual.md) 메커니즘을 사용하십시오.