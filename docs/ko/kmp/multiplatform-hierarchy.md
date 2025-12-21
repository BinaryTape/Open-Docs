[//]: # (title: 계층형 프로젝트 구조)

Kotlin Multiplatform 프로젝트는 계층형 소스 세트 구조를 지원합니다.
이는 [지원되는 타겟](multiplatform-dsl-reference.md#targets) 중 일부에서만 공통 코드를 공유하기 위해 중간 소스 세트의 계층을 구성할 수 있음을 의미합니다. 중간 소스 세트를 사용하면 다음을 수행하는 데 도움이 됩니다.

* 일부 타겟에 특정 API를 제공합니다. 예를 들어, 라이브러리는 Kotlin/Native 타겟을 위한 중간 소스 세트에 네이티브(native) 특정 API를 추가할 수 있지만, Kotlin/JVM 타겟에는 추가할 수 없습니다.
* 일부 타겟에 특정 API를 사용합니다. 예를 들어, Kotlin Multiplatform 라이브러리가 중간 소스 세트를 구성하는 일부 타겟에 대해 제공하는 풍부한 API의 이점을 누릴 수 있습니다.
* 프로젝트에서 플랫폼 의존적인 라이브러리를 사용합니다. 예를 들어, 중간 iOS 소스 세트에서 iOS 특정 의존성(dependency)에 접근할 수 있습니다.

Kotlin 툴체인(toolchain)은 각 소스 세트가 해당 소스 세트가 컴파일되는 모든 타겟에 사용 가능한 API에만 접근할 수 있도록 보장합니다. 이는 Windows 특정 API를 사용한 다음 macOS로 컴파일하여 링키지(linkage) 오류 또는 런타임(runtime) 시 정의되지 않은 동작을 초래하는 경우를 방지합니다.

소스 세트 계층을 설정하는 권장 방법은 [기본 계층 템플릿](#default-hierarchy-template)을 사용하는 것입니다. 이 템플릿은 가장 일반적인 경우를 다룹니다. 더 고급 프로젝트를 가지고 있다면 [수동으로 구성](#manual-configuration)할 수 있습니다. 이는 더 낮은 수준의 접근 방식이며, 더 유연하지만 더 많은 노력과 지식이 필요합니다.

## 기본 계층 템플릿

Kotlin Gradle 플러그인에는 내장된 기본 [계층 템플릿](#see-the-full-hierarchy-template)이 있습니다.
여기에는 일부 일반적인 사용 사례를 위한 미리 정의된 중간 소스 세트가 포함되어 있습니다.
플러그인은 프로젝트에 지정된 타겟을 기반으로 해당 소스 세트를 자동으로 설정합니다.

공유 코드를 포함하는 프로젝트 모듈의 `build.gradle(.kts)` 파일을 살펴보세요:

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

코드에서 `android`, `iosArm64`, `iosSimulatorArm64` 타겟을 선언하면 Kotlin Gradle 플러그인은 템플릿에서 적합한 공유 소스 세트를 찾아 생성해 줍니다. 결과 계층은 다음과 같습니다:

![기본 계층 템플릿 사용 예시](default-hierarchy-example.svg)

색상이 있는 소스 세트는 실제로 프로젝트에 생성되어 존재하며, 기본 템플릿의 회색 소스 세트는 무시됩니다. 예를 들어, 프로젝트에 watchOS 타겟이 없기 때문에 Kotlin Gradle 플러그인은 `watchos` 소스 세트를 생성하지 않았습니다.

`watchosArm64`와 같은 watchOS 타겟을 추가하면 `watchos` 소스 세트가 생성되고, `apple`, `native`, `common` 소스 세트의 코드가 `watchosArm64`로도 컴파일됩니다.

Kotlin Gradle 플러그인은 기본 계층 템플릿의 모든 소스 세트에 대해 타입-세이프(type-safe) 및 정적 접근자(static accessor)를 모두 제공하므로, [수동 구성](#manual-configuration)과 비교하여 `by getting` 또는 `by creating` 구성 없이 참조할 수 있습니다.

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

> 이 예시에서 `apple` 및 `native` 소스 세트는 `iosArm64` 및 `iosSimulatorArm64` 타겟으로만 컴파일됩니다. 이름과는 달리 이들은 전체 iOS API에 접근할 수 있습니다. 이는 `native`와 같은 소스 세트의 경우 직관적이지 않을 수 있습니다. 모든 네이티브 타겟에서 사용 가능한 API만 이 소스 세트에서 접근 가능할 것이라고 예상할 수 있기 때문입니다. 이 동작은 향후 변경될 수 있습니다.
>
{style="note"}

### 추가 구성

기본 계층 템플릿을 조정해야 할 수도 있습니다. 이전에 `dependsOn` 호출을 사용하여 [수동으로](#manual-configuration) 중간 소스를 도입했다면, 기본 계층 템플릿 사용이 취소되고 다음 경고가 발생합니다:

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

이 문제를 해결하려면 다음 중 하나를 수행하여 프로젝트를 구성하세요.

* [수동 구성을 기본 계층 템플릿으로 교체](#replacing-a-manual-configuration)
* [기본 계층 템플릿에 추가 소스 세트 생성](#creating-additional-source-sets)
* [기본 계층 템플릿으로 생성된 소스 세트 수정](#modifying-source-sets)

#### 수동 구성을 기본 계층 템플릿으로 교체

**경우**. 모든 중간 소스 세트가 현재 기본 계층 템플릿으로 다뤄지고 있는 경우.

**해결책**. 공유 모듈의 `build.gradle(.kts)` 파일에서 모든 수동 `dependsOn()` 호출과 `by creating` 구성으로 된 소스 세트를 제거하세요. 모든 기본 소스 세트 목록을 확인하려면 [전체 계층 템플릿](#see-the-full-hierarchy-template)을 참조하세요.

#### 추가 소스 세트 생성

**경우**. 기본 계층 템플릿이 아직 제공하지 않는 소스 세트를 추가하고 싶은 경우, 예를 들어 macOS와 JVM 타겟 사이에 하나를 추가하는 경우.

**해결책**:

1.  공유 모듈의 `build.gradle(.kts)` 파일에서 `applyDefaultHierarchyTemplate()`을 명시적으로 호출하여 템플릿을 다시 적용합니다.
2.  `dependsOn()`을 사용하여 추가 소스 세트를 [수동으로 구성](#manual-configuration)합니다.

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
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
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
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

#### 소스 세트 수정

**경우**. 템플릿에 의해 생성된 것과 정확히 동일한 이름을 가진 소스 세트가 이미 있지만, 프로젝트 내에서 다른 타겟 세트들 간에 공유되는 경우. 예를 들어, `nativeMain` 소스 세트가 데스크톱 특정 타겟인 `linuxX64`, `mingwX64`, `macosX64` 간에만 공유되는 경우.

**해결책**. 현재 템플릿의 소스 세트 간에 기본 `dependsOn` 관계를 수정할 방법은 없습니다. 또한 `nativeMain`과 같은 소스 세트의 구현과 의미가 모든 프로젝트에서 동일해야 한다는 점도 중요합니다.

하지만 다음 중 하나를 수행할 수 있습니다.

*   기본 계층 템플릿 또는 수동으로 생성된 소스 세트 중에서 목적에 맞는 다른 소스 세트를 찾습니다.
*   `gradle.properties` 파일에 `kotlin.mpp.applyDefaultHierarchyTemplate=false`를 추가하여 템플릿 사용을 완전히 해제하고 모든 소스 세트를 수동으로 구성합니다.

> 현재 자체 계층 템플릿을 생성할 수 있는 API를 개발 중입니다. 이는 계층 구성이 기본 템플릿과 크게 다른 프로젝트에 유용할 것입니다.
>
> 이 API는 아직 준비되지 않았지만, 사용해보고 싶다면 `applyHierarchyTemplate {}` 블록과 `KotlinHierarchyTemplate.default` 선언을 예시로 살펴보세요. 이 API는 아직 개발 중이라는 점을 명심하세요. 테스트되지 않았을 수 있으며 향후 릴리스에서 변경될 수 있습니다.
>
{style="tip"}

#### 전체 계층 템플릿 보기 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트가 컴파일될 타겟을 선언하면, 플러그인은 템플릿에서 지정된 타겟을 기반으로 공유 소스 세트를 선택하고 프로젝트에 생성합니다.

![기본 계층 템플릿](full-template-hierarchy.svg)

> 이 예시는 `Main` 접미사를 생략하고 프로젝트의 프로덕션(production) 부분만 보여줍니다(예: `commonMain` 대신 `common` 사용). 하지만 `*Test` 소스에서도 모든 것이 동일합니다.
>
{style="tip"}

## 수동 구성

소스 세트 구조에 중간 소스를 수동으로 도입할 수 있습니다. 이는 여러 타겟을 위한 공유 코드를 포함합니다.

예를 들어, 네이티브 Linux, Windows, macOS 타겟(`linuxX64`, `mingwX64`, `macosX64`) 간에 코드를 공유하고 싶다면 다음과 같이 하세요.

1.  공유 모듈의 `build.gradle(.kts)` 파일에 이 타겟들을 위한 공유 로직을 포함하는 중간 소스 세트인 `myDesktopMain`을 추가합니다.
2.  `dependsOn` 관계를 사용하여 소스 세트 계층을 설정합니다. `commonMain`을 `myDesktopMain`에 연결하고, 그 다음 `myDesktopMain`을 각 타겟 소스 세트에 연결합니다.

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

결과 계층 구조는 다음과 같습니다.

![수동으로 구성된 계층 구조](manual-hierarchical-structure.svg)

다음 타겟 조합에 대해 공유 소스 세트를 가질 수 있습니다.

*   JVM 또는 Android + JS + Native
*   JVM 또는 Android + Native
*   JS + Native
*   JVM 또는 Android + JS
*   Native

Kotlin은 현재 다음 조합에 대한 소스 세트 공유를 지원하지 않습니다.

*   여러 JVM 타겟
*   JVM + Android 타겟
*   여러 JS 타겟

공유 네이티브 소스 세트에서 플랫폼별 API에 접근해야 하는 경우, IntelliJ IDEA가 공유 네이티브 코드에서 사용할 수 있는 공통 선언을 탐지하는 데 도움을 줄 것입니다. 다른 경우에는 Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual.md) 메커니즘을 사용하세요.