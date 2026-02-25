[//]: # (title: 계층적 프로젝트 구조)

코틀린 멀티플랫폼(Kotlin Multiplatform) 프로젝트는 계층적 소스 세트(source set) 구조를 지원합니다.
이는 모든 [지원되는 타겟](multiplatform-dsl-reference.md#targets)이 아닌, 일부 타겟들 사이에서만 공통 코드를 공유하기 위해 중간 소스 세트의 계층을 구성할 수 있음을 의미합니다. 중간 소스 세트를 사용하면 다음과 같은 이점이 있습니다.

* **특정 타겟을 위한 전용 API 제공:** 예를 들어, 라이브러리는 코틀린/네이티브(Kotlin/Native) 타겟을 위한 중간 소스 세트에는 네이티브 전용 API를 추가하고, 코틀린/JVM(Kotlin/JVM) 타겟에는 추가하지 않을 수 있습니다.
* **특정 타겟을 위한 전용 API 소비:** 예를 들어, 코틀린 멀티플랫폼 라이브러리가 중간 소스 세트를 구성하는 일부 타겟들에 대해 제공하는 풍부한 API의 이점을 누릴 수 있습니다.
* **프로젝트에서 플랫폼 의존적인 라이브러리 사용:** 예를 들어, 중간 iOS 소스 세트에서 iOS 전용 의존성에 접근할 수 있습니다.

코틀린 툴체인은 각 소스 세트가 해당 소스 세트가 컴파일되는 모든 타겟에서 사용 가능한 API에만 접근할 수 있도록 보장합니다. 이를 통해 Windows 전용 API를 사용하고 이를 macOS로 컴파일하여 런타임에 링크 오류나 정의되지 않은 동작이 발생하는 경우를 방지합니다.

소스 세트 계층을 설정하는 권장 방법은 [기본 계층 템플릿(default hierarchy template)](#default-hierarchy-template)을 사용하는 것입니다. 이 템플릿은 가장 대중적인 사례들을 다룹니다. 더 고급 프로젝트를 진행 중이라면 [수동으로 구성](#manual-configuration)할 수도 있습니다. 수동 구성은 더 저수준의 접근 방식으로, 더 유연하지만 더 많은 노력과 지식이 필요합니다.

## 기본 계층 템플릿

코틀린 그레이들(Gradle) 플러그인에는 내장된 기본 [계층 템플릿](#see-the-full-hierarchy-template)이 있습니다.
여기에는 대중적인 사용 사례를 위해 미리 정의된 중간 소스 세트들이 포함되어 있습니다.
플러그인은 프로젝트에 지정된 타겟을 기반으로 이러한 소스 세트들을 자동으로 설정합니다.

공유 코드가 포함된 프로젝트 모듈의 다음 `build.gradle(.kts)` 파일을 살펴보세요.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

코드에서 `android`, `iosArm64`, `iosSimulatorArm64` 타겟을 선언하면, 코틀린 그레이들 플러그인은 템플릿에서 적합한 공유 소스 세트를 찾아 생성해 줍니다. 결과적인 계층 구조는 다음과 같습니다:

![기본 계층 템플릿 사용 예시](default-hierarchy-example.svg)

색상이 있는 소스 세트는 실제로 프로젝트에 생성되어 존재하는 것이며, 기본 템플릿의 회색 소스 세트들은 무시됩니다. 예를 들어 프로젝트에 watchOS 타겟이 없으므로 코틀린 그레이들 플러그인은 `watchos` 소스 세트를 생성하지 않았습니다.

만약 `watchosArm64`와 같은 watchOS 타겟을 추가하면, `watchos` 소스 세트가 생성되고 `apple`, `native`, `common` 소스 세트의 코드도 `watchosArm64`로 컴파일됩니다.

코틀린 그레이들 플러그인은 기본 계층 템플릿의 모든 소스 세트에 대해 타입 안전 접근자(type-safe accessors)와 정적 접근자(static accessors)를 모두 제공하므로, [수동 구성](#manual-configuration)과 비교했을 때 `by getting` 또는 `by creating` 구문 없이도 이를 참조할 수 있습니다.

공유 모듈의 `build.gradle(.kts)` 파일에서 해당 타겟을 먼저 선언하지 않고 소스 세트에 접근하려고 하면 경고가 표시됩니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 경고: 타겟을 선언하지 않고 소스 세트에 접근함
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 경고: 타겟을 선언하지 않고 소스 세트에 접근함
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> 이 예시에서 `apple`과 `native` 소스 세트는 오직 `iosArm64`와 `iosSimulatorArm64` 타겟으로만 컴파일됩니다.
> 이름에도 불구하고, 이들은 전체 iOS API에 접근할 수 있습니다.
> 이는 `native`와 같은 소스 세트에 대해 모든 네이티브 타겟에서 사용 가능한 API만 접근 가능할 것이라고 예상하는 경우 직관적이지 않을 수 있습니다. 이 동작은 향후 변경될 수 있습니다.
>
{style="note"}

### 추가 구성

기본 계층 템플릿을 조정해야 할 수도 있습니다. 이전에 `dependsOn` 호출을 통해 중간 소스를 [수동으로](#manual-configuration) 도입한 경우, 기본 계층 템플릿 사용이 취소되고 다음과 같은 경고가 발생합니다:

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

이 문제를 해결하려면 다음 중 하나를 수행하여 프로젝트를 구성하세요:

* [수동 구성을 기본 계층 템플릿으로 교체](#replacing-a-manual-configuration)
* [기본 계층 템플릿에 추가 소스 세트 생성](#creating-additional-source-sets)
* [기본 계층 템플릿에 의해 생성된 소스 세트 수정](#modifying-source-sets)

#### 수동 구성을 교체하기

**상황**. 모든 중간 소스 세트가 현재 기본 계층 템플릿에서 다루고 있는 범위 내에 있는 경우.

**해결책**. 공유 모듈의 `build.gradle(.kts)` 파일에서 모든 수동 `dependsOn()` 호출과 `by creating` 구문을 사용한 소스 세트를 제거합니다. 모든 기본 소스 세트 목록을 확인하려면 [전체 계층 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

#### 추가 소스 세트 생성하기

**상황**. 기본 계층 템플릿이 아직 제공하지 않는 소스 세트를 추가하고 싶은 경우 (예: macOS 타겟과 JVM 타겟 사이의 소스 세트).

**해결책**:

1. 공유 모듈의 `build.gradle(.kts)` 파일에서 `applyDefaultHierarchyTemplate()`을 명시적으로 호출하여 템플릿을 다시 적용합니다.
2. `dependsOn()`을 사용하여 추가 소스 세트를 [수동으로](#manual-configuration) 구성합니다:

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 기본 계층을 다시 적용합니다. 예를 들어 iosMain 소스 세트가 생성됩니다:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 추가적인 jvmAndMacos 소스 세트를 생성합니다:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 기본 계층을 다시 적용합니다. 예를 들어 iosMain 소스 세트가 생성됩니다:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 추가적인 jvmAndMacos 소스 세트를 생성합니다:
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

    </TabItem>
    </Tabs>

#### 소스 세트 수정하기

**상황**. 템플릿에 의해 생성된 것과 정확히 동일한 이름을 가진 소스 세트가 이미 있지만, 프로젝트의 다른 타겟 세트들 사이에서 공유되고 있는 경우. 예를 들어, `nativeMain` 소스 세트가 데스크톱 전용 타겟인 `linuxX64`, `mingwX64`, `macosX64` 사이에서만 공유되는 경우입니다.

**해결책**. 현재 템플릿의 소스 세트들 사이에서 기본 `dependsOn` 관계를 수정할 수 있는 방법은 없습니다. 또한 `nativeMain`과 같은 소스 세트의 구현과 의미가 모든 프로젝트에서 동일하게 유지되는 것도 중요합니다.

하지만 다음 중 하나를 수행할 수 있습니다:

* 기본 계층 템플릿이나 수동으로 생성된 소스 세트 중에서 목적에 맞는 다른 소스 세트를 찾습니다.
* `gradle.properties` 파일에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하여 템플릿 사용을 완전히 중단하고 모든 소스 세트를 수동으로 구성합니다.

> 현재 고유한 계층 템플릿을 생성할 수 있는 API를 작업 중입니다. 이는 계층 구성이 기본 템플릿과 크게 다른 프로젝트에 유용할 것입니다.
>
> 이 API는 아직 준비되지 않았지만, 미리 사용해 보고 싶다면 `applyHierarchyTemplate {}` 블록과 `KotlinHierarchyTemplate.default` 선언을 예시로 살펴보세요.
> 이 API는 아직 개발 중임을 유의하세요. 테스트가 완료되지 않았을 수 있으며 향후 릴리스에서 변경될 수 있습니다.
>
{style="tip"}

#### 전체 계층 템플릿 보기 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트가 컴파일되는 타겟을 선언하면, 플러그인은 템플릿에서 지정된 타겟을 기반으로 공유 소스 세트를 선택하여 프로젝트에 생성합니다.

![전체 계층 템플릿](full-template-hierarchy.svg)

> 이 예시는 프로젝트의 프로덕션 부분만 보여주며 `Main` 접미사를 생략했습니다 (예: `commonMain` 대신 `common` 사용). 하지만 `*Test` 소스에 대해서도 모든 것이 동일하게 적용됩니다.
>
{style="tip"}

## 수동 구성

소스 세트 구조에 중간 소스를 수동으로 도입할 수 있습니다. 이는 여러 타겟을 위한 공유 코드를 보관하게 됩니다.

예를 들어, 네이티브 Linux, Windows, macOS 타겟(`linuxX64`, `mingwX64`, `macosX64`) 간에 코드를 공유하려는 경우 수행할 작업은 다음과 같습니다:

1. 공유 모듈의 `build.gradle(.kts)` 파일에 이러한 타겟들의 공유 로직을 보관할 중간 소스 세트 `myDesktopMain`을 추가합니다.
2. `dependsOn` 관계를 사용하여 소스 세트 계층을 설정합니다. `commonMain`을 `myDesktopMain`과 연결한 다음, `myDesktopMain`을 각 타겟 소스 세트와 연결합니다:

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosX64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            myDesktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(myDesktopMain)
            }
            mingwX64Main {
                dependsOn(myDesktopMain)
            }
            macosX64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

결과적인 계층 구조는 다음과 같습니다:

![수동으로 구성된 계층 구조](manual-hierarchical-structure.svg)

다음 타겟 조합에 대해 공유 소스 세트를 가질 수 있습니다:

* JVM 또는 Android + Web + Native
* JVM 또는 Android + Native
* Web + Native
* JVM 또는 Android + Web
* Native

코틀린은 현재 다음 조합에 대한 소스 세트 공유를 지원하지 않습니다:

* 여러 JVM 타겟
* JVM + Android 타겟
* 여러 JS 타겟

공유 네이티브 소스 세트에서 플랫폼 전용 API에 접근해야 하는 경우, IntelliJ IDEA는 공유 네이티브 코드에서 사용할 수 있는 공통 선언을 찾는 데 도움을 줍니다. 그 외의 경우에는 코틀린의 [expect 및 actual 선언](multiplatform-expect-actual.md) 메커니즘을 사용하세요.