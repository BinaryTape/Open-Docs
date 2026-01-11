[//]: # (title: 네이티브 배포)

여기서는 네이티브 배포에 대해 알아봅니다. 지원되는 모든 시스템에 대한 설치 프로그램 및 패키지를 생성하는 방법과
배포와 동일한 설정으로 애플리케이션을 로컬에서 실행하는 방법을 다룹니다.

다음 주제에 대한 자세한 내용은 계속해서 읽어보십시오.

*   [Compose Multiplatform Gradle 플러그인이란 무엇인가요](#gradle-plugin)?
*   애플리케이션을 로컬에서 실행하는 것과 같은 [기본 태스크](#basic-tasks)와 코드 압축 및 난독화와 같은 [고급 태스크](#minification-and-obfuscation)에 대한 세부 정보.
*   [JDK 모듈을 포함하는 방법](#including-jdk-modules) 및 `ClassNotFoundException` 처리.
*   [배포 속성을 지정하는 방법](#specifying-distribution-properties): 패키지 버전, JDK 버전, 출력 디렉터리, 런처 속성 및 메타데이터.
*   리소스 라이브러리, JVM 리소스 로딩, 또는 패키지된 애플리케이션에 파일을 추가하여 [리소스를 관리하는 방법](#managing-resources).
*   Gradle 소스 세트, Kotlin JVM 타겟, 또는 수동으로 [사용자 지정 소스 세트를 설정하는 방법](#custom-source-sets).
*   각 OS에 대해 [애플리케이션 아이콘을 지정하는 방법](#application-icon).
*   Linux에서 패키지 관리자의 이메일, macOS에서 Apple App Store의 앱 카테고리와 같은 [플랫폼별 옵션](#platform-specific-options).
*   [macOS별 구성](#macos-specific-configuration): 서명, 공증 및 `Info.plist`.

## Gradle 플러그인

이 가이드는 주로 Compose Multiplatform Gradle 플러그인을 사용하여 Compose 애플리케이션을 패키징하는 데 중점을 둡니다.
`org.jetbrains.compose` 플러그인은 기본 패키징, 난독화 및 macOS 코드 서명 작업을 제공합니다.

이 플러그인은 `jpackage`를 사용하여 애플리케이션을 네이티브 배포로 패키징하고 애플리케이션을 로컬에서 실행하는 프로세스를 단순화합니다.
배포 가능한 애플리케이션은 자체 포함된(self-contained) 설치 가능한 바이너리로, 대상 시스템에 JDK가 설치되어 있지 않아도
필요한 모든 Java 런타임 구성 요소를 포함합니다.

패키지 크기를 최소화하기 위해 Gradle 플러그인은 [jlink](https://openjdk.org/jeps/282) 도구를 사용하여
배포 가능한 패키지에 필요한 Java 모듈만 번들링하도록 합니다.
그러나 필요한 모듈을 지정하려면 Gradle 플러그인을 구성해야 합니다.
자세한 내용은 [JDK 모듈 포함](#including-jdk-modules) 섹션을 참조하십시오.

대안으로 JetBrains에서 개발하지 않은 외부 도구인 [Conveyor](https://www.hydraulic.software)를 사용할 수 있습니다.
Conveyor는 온라인 업데이트, 교차 빌딩 및 기타 다양한 기능을 지원하지만, 오픈 소스가 아닌 프로젝트에는 [라이선스](https://hydraulic.software/pricing.html)가 필요합니다.
자세한 내용은 [Conveyor 문서](https://conveyor.hydraulic.dev/latest/tutorial/hare/jvm)를 참조하십시오.

## 기본 태스크

Compose Multiplatform Gradle 플러그인의 기본 구성 가능 단위는 `application`입니다 (더 이상 사용되지 않는 [Gradle application](https://docs.gradle.org/current/userguide/application_plugin.html) 플러그인과 혼동하지 마십시오).

`application` DSL 메서드는 최종 바이너리 세트에 대한 공유 구성을 정의합니다. 이는
JDK 배포판과 함께 파일 컬렉션을 다양한 형식의 압축된 바이너리 설치 프로그램 세트로 패키징할 수 있음을 의미합니다.

지원되는 운영 체제에서 사용 가능한 형식은 다음과 같습니다.

*   **macOS**: `.dmg` (`TargetFormat.Dmg`), `.pkg` (`TargetFormat.Pkg`)
*   **Windows**: `.exe` (`TargetFormat.Exe`), `.msi` (`TargetFormat.Msi`)
*   **Linux**: `.deb` (`TargetFormat.Deb`), `.rpm` (`TargetFormat.Rpm`)

다음은 기본적인 데스크톱 구성이 포함된 `build.gradle.kts` 파일의 예시입니다.

```kotlin
import org.jetbrains.compose.desktop.application.dsl.TargetFormat

plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}

dependencies {
    implementation(compose.desktop.currentOs)
}

compose.desktop {
    application {
        mainClass = "example.MainKt"

        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Exe)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { mainClass = "}

프로젝트를 빌드하면 플러그인은 다음 태스크를 생성합니다.

<table>
    
<tr>
<td>Gradle 태스크</td>
        <td>설명</td>
</tr>

    
<tr>
<td><code>package&lt;FormatName&gt;</code></td> 
        <td>애플리케이션을 해당 <code>FormatName</code> 바이너리로 패키징합니다. 교차 컴파일은 현재 지원되지 않으므로, 
            호환되는 OS를 사용해야만 특정 형식을 빌드할 수 있습니다.
            예를 들어, <code>.dmg</code> 바이너리를 빌드하려면 macOS에서 <code>packageDmg</code> 태스크를 실행해야 합니다. 
            만약 현재 OS와 호환되지 않는 태스크가 있다면, 기본적으로 건너뛰어집니다.</td>
</tr>

    
<tr>
<td><code>packageDistributionForCurrentOS</code></td>
        <td>애플리케이션에 대한 모든 패키지 태스크를 집계합니다. 이는 <a href="https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:task_categories">수명 주기 태스크</a>입니다.</td>
</tr>

    
<tr>
<td><code>packageUberJarForCurrentOS</code></td>
        <td>현재 운영 체제에 대한 모든 의존성을 포함하는 단일 JAR 파일을 생성합니다. 
        이 태스크는 <code>compose.desktop.currentOS</code>가 <code>compile</code>, <code>implementation</code>, 또는 <code>runtime</code> 의존성으로 사용될 것을 예상합니다.</td>
</tr>

    
<tr>
<td><code>run</code></td>
        <td><code>mainClass</code>에 지정된 진입점에서 애플리케이션을 로컬에서 실행합니다. <code>run</code> 태스크는 전체 런타임을 사용하여 비패키지 JVM 애플리케이션을 시작합니다. 
        이 접근 방식은 압축된 런타임으로 컴팩트 바이너리 이미지를 생성하는 것보다 빠르고 디버깅하기 쉽습니다. 
        최종 바이너리 이미지를 실행하려면 대신 <code>runDistributable</code> 태스크를 사용하십시오.</td>
</tr>

    
<tr>
<td><code>createDistributable</code></td>
        <td>설치 프로그램을 생성하지 않고 최종 애플리케이션 이미지를 생성합니다.</td>
</tr>

    
<tr>
<td><code>runDistributable</code></td>
        <td>사전 패키지된 애플리케이션 이미지를 실행합니다.</td>
</tr>

</table>

사용 가능한 모든 태스크는 Gradle 도구 창에 나열됩니다. 태스크를 실행하면 Gradle은 `${project.buildDir}/compose/binaries` 디렉터리에 출력 바이너리를 생성합니다.

## JDK 모듈 포함

배포 가능한 크기를 줄이기 위해 Gradle 플러그인은 [jlink](https://openjdk.org/jeps/282)를 사용하며, 이는 필요한 JDK 모듈만 번들링하는 데 도움이 됩니다.

현재 Gradle 플러그인은 필요한 JDK 모듈을 자동으로 결정하지 않습니다. 이는 컴파일 문제를 일으키지 않지만,
필요한 모듈을 제공하지 않으면 런타임에 `ClassNotFoundException`이 발생할 수 있습니다.

패키지된 애플리케이션 또는 `runDistributable` 태스크를 실행할 때 `ClassNotFoundException`이 발생하면,
`modules` DSL 메서드를 사용하여 추가 JDK 모듈을 포함할 수 있습니다.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("java.sql")
            // Alternatively: includeAllModules = true
        }
    }
}
```

필요한 모듈을 수동으로 지정하거나 `suggestModules`를 실행할 수 있습니다. `suggestModules` 태스크는
[jdeps](https://docs.oracle.com/javase/9/tools/jdeps.htm) 정적 분석 도구를 사용하여 누락될 수 있는 모듈을 결정합니다.
이 도구의 출력이 불완전하거나 불필요한 모듈을 나열할 수 있다는 점에 유의하십시오.

배포 가능 파일의 크기가 중요한 요소가 아니고 무시할 수 있다면, `includeAllModules` DSL 속성을 사용하여 모든 런타임 모듈을 포함하도록 선택할 수 있습니다.

## 배포 속성 지정

### 패키지 버전

네이티브 배포 패키지에는 특정 패키지 버전이 있어야 합니다.
패키지 버전을 지정하려면 다음 DSL 속성을 가장 높은 우선순위부터 가장 낮은 우선순위 순으로 사용할 수 있습니다.

*   `nativeDistributions.<os>.<packageFormat>PackageVersion`은 단일 패키지 형식에 대한 버전을 지정합니다.
*   `nativeDistributions.<os>.packageVersion`은 단일 대상 OS에 대한 버전을 지정합니다.
*   `nativeDistributions.packageVersion`은 모든 패키지에 대한 버전을 지정합니다.

macOS에서는 다음 DSL 속성을 사용하여 빌드 버전을 지정할 수도 있습니다(다시 가장 높은 우선순위부터 가장 낮은 우선순위 순으로 나열됨).

*   `nativeDistributions.macOS.<packageFormat>PackageBuildVersion`은 단일 패키지 형식에 대한 빌드 버전을 지정합니다.
*   `nativeDistributions.macOS.packageBuildVersion`은 모든 macOS 패키지에 대한 빌드 버전을 지정합니다.

빌드 버전을 지정하지 않으면 Gradle은 패키지 버전을 대신 사용합니다. macOS 버전 관리에 대한 자세한 내용은
[`CFBundleShortVersionString`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)
및 [`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion) 문서를 참조하십시오.

다음은 우선순위 순으로 패키지 버전을 지정하기 위한 템플릿입니다.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            // Version for all packages
            packageVersion = "..." 
          
            macOS {
              // Version for all macOS packages
              packageVersion = "..."
              // Version for the dmg package only
              dmgPackageVersion = "..." 
              // Version for the pkg package only
              pkgPackageVersion = "..." 
              
              // Build version for all macOS packages
              packageBuildVersion = "..."
              // Build version for the dmg package only
              dmgPackageBuildVersion = "..." 
              // Build version for the pkg package only
              pkgPackageBuildVersion = "..." 
            }
            windows {
              // Version for all Windows packages
              packageVersion = "..."  
              // Version for the msi package only
              msiPackageVersion = "..."
              // Version for the exe package only
              exePackageVersion = "..." 
            }
            linux {
              // Version for all Linux packages
              packageVersion = "..."
              // Version for the deb package only
              debPackageVersion = "..."
              // Version for the rpm package only
              rpmPackageVersion = "..."
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { nativeDistributions { packageVersion ="}

패키지 버전을 정의하려면 다음 규칙을 따르십시오.

<table>
    
<tr>
<td>파일 형식</td>
        <td>버전 형식</td>
        <td>세부 정보</td>
</tr>

    
<tr>
<td><code>dmg</code>, <code>pkg</code></td>
        <td><code>MAJOR[.MINOR][.PATCH]</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>는 0보다 큰 정수입니다.</li>
                <li><code>MINOR</code>는 선택적 음이 아닌 정수입니다.</li>
                <li><code>PATCH</code>는 선택적 음이 아닌 정수입니다.</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>msi</code>, <code>exe</code></td>
        <td><code>MAJOR.MINOR.BUILD</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code>는 최대값 255를 가진 음이 아닌 정수입니다.</li>
                <li><code>MINOR</code>는 최대값 255를 가진 음이 아닌 정수입니다.</li>
                <li><code>BUILD</code>는 최대값 65535를 가진 음이 아닌 정수입니다.</li>
            </ul>
        </td>
</tr>

    
<tr>
<td><code>deb</code></td>
        <td><code>[EPOCH:]UPSTREAM_VERSION[-DEBIAN_REVISION]</code></td>
        <td>
            <ul>
                <li><code>EPOCH</code>는 선택적 음이 아닌 정수입니다.</li>
                <li><code>UPSTREAM_VERSION</code>:
                    <ul>
                        <li>영숫자와 <code>.</code>, <code>+</code>, <code>-</code>, <code>~</code> 문자만 포함할 수 있습니다.</li>
                        <li>숫자로 시작해야 합니다.</li>
                    </ul>
                </li>
                <li><code>DEBIAN_REVISION</code>:
                    <ul>
                        <li>선택 사항</li>
                        <li>영숫자와 <code>.</code>, <code>+</code>, <code>~</code> 문자만 포함할 수 있습니다.</li>
                    </ul>
                </li>
            </ul>
            자세한 내용은 <a href="https://www.debian.org/doc/debian-policy/ch-controlfields.html#version">Debian 문서</a>를 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>rpm</code></td>
        <td>모든 형식</td>
        <td>버전은 <code>-</code> (대시) 문자를 포함해서는 안 됩니다.</td>
</tr>

</table>

### JDK 버전

플러그인은 [JDK 17](https://openjdk.java.net/projects/jdk/17/) 이상 버전을 요구하는 `jpackage`를 사용합니다.
JDK 버전을 지정할 때는 다음 요구 사항 중 하나 이상을 충족하는지 확인하십시오.

*   `JAVA_HOME` 환경 변수가 호환되는 JDK 버전을 가리킵니다.
*   `javaHome` 속성이 DSL을 통해 설정됩니다.

  ```kotlin
  compose.desktop {
      application {
          javaHome = System.getenv("JDK_17")
      }
  }
  ```

### 출력 디렉터리

네이티브 배포판에 사용자 지정 출력 디렉터리를 사용하려면 다음과 같이 `outputBaseDir` 속성을 구성하십시오.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            outputBaseDir.set(project.layout.buildDirectory.dir("customOutputDir"))
        }
    }
}
```

### 런처 속성

애플리케이션 시작 프로세스를 사용자 지정하려면 다음 속성을 구성할 수 있습니다.

<table>
  
<tr>
<td>속성</td>
    <td>설명</td>
</tr>

  
<tr>
<td><code>mainClass</code></td>
    <td><code>main</code> 메서드를 포함하는 클래스의 정규화된 이름입니다.</td>
</tr>

  
<tr>
<td><code>args</code></td>
    <td>애플리케이션의 <code>main</code> 메서드에 대한 인수입니다.</td>
</tr>

  
<tr>
<td><code>jvmArgs</code></td>
    <td>애플리케이션의 JVM에 대한 인수입니다.</td>
</tr>

</table>

다음은 구성 예시입니다.

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        args += listOf("-customArgument")
        jvmArgs += listOf("-Xmx2G")
    }
}
```

### 메타데이터

`nativeDistributions` DSL 블록 내에서 다음 속성을 구성할 수 있습니다.

<table>
  
<tr>
<td>속성</td>
    <td>설명</td>
    <td>기본값</td>
</tr>

  
<tr>
<td><code>packageName</code></td>
    <td>애플리케이션 이름입니다.</td>
    <td>Gradle 프로젝트의 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getName--">이름</a></td>
</tr>

  
<tr>
<td><code>packageVersion</code></td>
    <td>애플리케이션 버전입니다.</td>
    <td>Gradle 프로젝트의 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getVersion--">버전</a></td>
</tr>

  
<tr>
<td><code>description</code></td>
    <td>애플리케이션 설명입니다.</td>
    <td>없음</td>
</tr>

  
<tr>
<td><code>copyright</code></td>
    <td>애플리케이션의 저작권 정보입니다.</td>
    <td>없음</td>
</tr>

  
<tr>
<td><code>vendor</code></td>
    <td>애플리케이션 공급업체입니다.</td>
    <td>없음</td>
</tr>

  
<tr>
<td><code>licenseFile</code></td>
    <td>애플리케이션의 라이선스 파일입니다.</td>
    <td>없음</td>
</tr>

</table> 

다음은 구성 예시입니다.

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            packageName = "ExampleApp"
            packageVersion = "0.1-SNAPSHOT"
            description = "Compose Multiplatform App"
            copyright = "© 2024 My Name. All rights reserved."
            vendor = "Example vendor"
            licenseFile.set(project.file("LICENSE.txt"))
        }
    }
}
```

## 리소스 관리

리소스를 패키징하고 로드하려면 Compose Multiplatform 리소스 라이브러리, JVM 리소스 로딩, 또는 패키지된 애플리케이션에 파일을 추가하는 방법을 사용할 수 있습니다.

### 리소스 라이브러리

프로젝트에 리소스를 설정하는 가장 간단한 방법은 리소스 라이브러리를 사용하는 것입니다.
리소스 라이브러리를 사용하면 지원되는 모든 플랫폼에서 공통 코드 내 리소스에 접근할 수 있습니다.
자세한 내용은 [멀티플랫폼 리소스](compose-multiplatform-resources.md)를 참조하십시오.

### JVM 리소스 로딩

데스크톱용 Compose Multiplatform은 JVM 플랫폼에서 작동하므로 `java.lang.Class` API를 사용하여 `.jar` 파일에서 리소스를 로드할 수 있습니다.
`src/main/resources` 디렉터리에 있는 파일은
[`Class::getResource`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResource(java.lang.String))
또는 [`Class::getResourceAsStream`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResourceAsStream(java.lang.String))을 통해 접근할 수 있습니다.

### 패키지된 애플리케이션에 파일 추가

`.jar` 파일에서 리소스를 로드하는 것이 덜 실용적인 시나리오가 있습니다. 예를 들어, 대상별 자산이 있어서
macOS 패키지에만 파일을 포함하고 Windows 패키지에는 포함하지 않으려는 경우입니다.

이러한 경우 Gradle 플러그인을 구성하여 설치 디렉터리에 추가 리소스 파일을 포함할 수 있습니다.
다음과 같이 DSL을 사용하여 루트 리소스 디렉터리를 지정하십시오.

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Deb)
            packageVersion = "1.0.0"

            appResourcesRootDir.set(project.layout.projectDirectory.dir("resources"))
        }
    }
}
```

위 예시에서 루트 리소스 디렉터리는 `<PROJECT_DIR>/resources`로 정의됩니다.

Gradle 플러그인은 다음과 같이 리소스 하위 디렉터리에서 파일을 포함합니다.

1.  **공통 리소스:**
    `<RESOURCES_ROOT_DIR>/common`에 있는 파일은 대상 OS나 아키텍처에 관계없이 모든 패키지에 포함됩니다.

2.  **OS별 리소스:**
    `<RESOURCES_ROOT_DIR>/<OS_NAME>`에 있는 파일은 특정 운영 체제용으로 빌드된 패키지에만 포함됩니다.
    `<OS_NAME>`에 유효한 값은 `windows`, `macos`, `linux`입니다.

3.  **OS 및 아키텍처별 리소스:**
    `<RESOURCES_ROOT_DIR>/<OS_NAME>-<ARCH_NAME>`에 있는 파일은 특정 운영 체제 및 CPU 아키텍처 조합용으로 빌드된 패키지에만 포함됩니다.
    `<ARCH_NAME>`에 유효한 값은 `x64`와 `arm64`입니다.
    예를 들어, `<RESOURCES_ROOT_DIR>/macos-arm64`의 파일은 Apple Silicon Mac용 패키지에만 포함됩니다.

포함된 리소스는 `compose.application.resources.dir` 시스템 속성을 사용하여 접근할 수 있습니다.

```kotlin
import java.io.File

val resourcesDir = File(System.getProperty("compose.application.resources.dir"))

fun main() {
    println(resourcesDir.resolve("resource.txt").readText())
}
```

## 사용자 지정 소스 세트

`org.jetbrains.kotlin.jvm` 또는
`org.jetbrains.kotlin.multiplatform` 플러그인을 사용하는 경우 기본 구성을 사용할 수 있습니다.

*   `org.jetbrains.kotlin.jvm`을 사용한 구성은 `main` [소스 세트](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)의 내용을 포함합니다.
*   `org.jetbrains.kotlin.multiplatform`을 사용한 구성은 단일 [JVM 타겟](multiplatform-dsl-reference.md#targets)의 내용을 포함합니다.
    여러 JVM 타겟을 정의하는 경우 기본 구성은 비활성화됩니다. 이 경우 플러그인을 수동으로 구성하거나
    단일 타겟을 지정해야 합니다(아래 참조).

기본 구성이 모호하거나 불충분한 경우 여러 가지 방법으로 사용자 지정할 수 있습니다.

Gradle [소스 세트](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets) 사용:

``` kotlin
plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}
val customSourceSet = sourceSets.create("customSourceSet")
compose.desktop {
    application {
        from(customSourceSet)
    }
}
``` 

Kotlin [JVM 타겟](multiplatform-dsl-reference.md#targets) 사용:

``` kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
} 
kotlin {
    jvm("customJvmTarget") {}
}
compose.desktop {
    application {
        from(kotlin.targets["customJvmTarget"])
    }
}
```

수동으로:

*   `disableDefaultConfiguration`을 사용하여 기본 설정을 비활성화합니다.
*   `fromFiles`를 사용하여 포함할 파일을 지정합니다.
*   `mainJar` 파일 속성을 지정하여 메인 클래스를 포함하는 `.jar` 파일을 가리킵니다.
*   `dependsOn`을 사용하여 모든 플러그인 태스크에 태스크 의존성을 추가합니다.
``` kotlin
compose.desktop {
    application {
        disableDefaultConfiguration()
        fromFiles(project.fileTree("libs/") { include("**/*.jar") })
        mainJar.set(project.file("main.jar"))
        dependsOn("mainJarTask")
    }
}
```

## 애플리케이션 아이콘

앱 아이콘이 다음 OS별 형식으로 사용 가능한지 확인하십시오.

*   macOS용 `.icns`
*   Windows용 `.ico`
*   Linux용 `.png`

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                iconFile.set(project.file("icon.icns"))
            }
            windows {
                iconFile.set(project.file("icon.ico"))
            }
            linux {
                iconFile.set(project.file("icon.png"))
            }
        }
    }
}
```

## 플랫폼별 옵션

플랫폼별 설정은 해당 DSL 블록을 사용하여 구성할 수 있습니다.

``` kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                // Options for macOS
            }
            windows {
                // Options for Windows
            }
            linux {
                // Options for Linux
            }
        }
    }
}
```

다음 표는 지원되는 모든 플랫폼별 옵션을 설명합니다. 문서화되지 않은 속성은 **사용하지 않는 것이 좋습니다**.

<table>
    
<tr>
<td>플랫폼</td>
        <td>옵션</td>
        <td width="500">설명</td>
</tr>

    
<tr>
<td rowspan="3">모든 플랫폼</td>
        <td><code>iconFile.set(File("PATH_TO_ICON"))</code></td>
        <td>애플리케이션에 대한 플랫폼별 아이콘 경로를 지정합니다. 자세한 내용은 <a href="#application-icon">애플리케이션 아이콘</a> 섹션을 참조하십시오.</td>
</tr>

    
<tr>
<td><code>packageVersion = "1.0.0"</code></td>
        <td>플랫폼별 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.</td>
</tr>

    
<tr>
<td><code>installationPath = "PATH_TO_INST_DIR"</code></td>
        <td>기본 설치 디렉터리에 대한 절대 또는 상대 경로를 지정합니다.
            Windows에서는 <code>dirChooser = true</code>를 사용하여 설치 중 경로 사용자 지정을 활성화할 수도 있습니다.</td>
</tr>

    
<tr>
<td rowspan="8">Linux</td>
        <td><code>packageName = "custom-package-name"</code></td>
        <td>기본 애플리케이션 이름을 재정의합니다.</td>
</tr>

    
<tr>
<td><code>debMaintainer = "maintainer@example.com"</code></td>
        <td>패키지 관리자의 이메일을 지정합니다.</td>
</tr>

    
<tr>
<td><code>menuGroup = "my-example-menu-group"</code></td>
        <td>애플리케이션에 대한 메뉴 그룹을 정의합니다.</td>
</tr>

    
<tr>
<td><code>appRelease = "1"</code></td>
        <td>rpm 패키지의 릴리스 값 또는 deb 패키지의 개정(revision) 값을 설정합니다.</td>
</tr>

    
<tr>
<td><code>appCategory = "CATEGORY"</code></td>
        <td>rpm 패키지의 그룹 값 또는 deb 패키지의 섹션 값을 할당합니다.</td>
</tr>

    
<tr>
<td><code>rpmLicenseType = "TYPE_OF_LICENSE"</code></td>
        <td>rpm 패키지의 라이선스 유형을 나타냅니다.</td>
</tr>

    
<tr>
<td><code>debPackageVersion = "DEB_VERSION"</code></td>
        <td>deb 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.</td>
</tr>

    
<tr>
<td><code>rpmPackageVersion = "RPM_VERSION"</code></td>
        <td>rpm 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.</td>
</tr>

    
<tr>
<td rowspan="15">macOS</td>
        <td><code>bundleID</code></td>
        <td>
            영숫자(<code>A-Z</code>, <code>a-z</code>, <code>0-9</code>), 하이픈(<code>-</code>), 그리고 
            점(<code>.</code>)만 포함할 수 있는 고유한 애플리케이션 식별자를 지정합니다. 역방향 DNS 표기법(<code>com.mycompany.myapp</code>)을 사용하는 것이 좋습니다.
        </td>
</tr>

    
<tr>
<td><code>packageName</code></td>
        <td>애플리케이션 이름입니다.</td>
</tr>

    
<tr>
<td><code>dockName</code></td>
        <td>
            메뉴 바, "About &lt;App&gt;" 메뉴 항목, 
            및 독(dock)에 표시되는 애플리케이션 이름입니다. 기본값은 <code>packageName</code>입니다.
        </td>
</tr>

    
<tr>
<td><code>minimumSystemVersion</code></td>
        <td>
            애플리케이션을 실행하는 데 필요한 최소 macOS 버전입니다. 자세한 내용은
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsminimumsystemversion">
                <code>LSMinimumSystemVersion</code></a>을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>signing</code>, <code>notarization</code>, <code>provisioningProfile</code>, <code>runtimeProvisioningProfile</code></td>
        <td>
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS용 배포판 서명 및 공증</a> 튜토리얼을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>appStore = true</code></td>
        <td>Apple App Store용으로 앱을 빌드하고 서명할지 여부를 지정합니다. JDK 17 이상이 필요합니다.</td>
</tr>

    
<tr>
<td><code>appCategory</code></td>
        <td>
            Apple App Store용 앱 카테고리입니다. App Store용으로 빌드할 때 기본값은 
            <code>public.app-category.utilities</code>이고, 그렇지 않으면 <code>Unknown</code>입니다.
            유효한 카테고리 목록은 
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype">
                <code>LSApplicationCategoryType</code>
            </a>를 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>entitlementsFile.set(File("PATH_ENT"))</code></td>
        <td>
            서명 시 사용되는 권한이 포함된 파일의 경로를 지정합니다. 사용자 지정 파일을 제공할 때, 
            Java 애플리케이션에 필요한 권한을 추가해야 합니다. App Store용으로 빌드할 때 사용되는 기본 파일은 
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>를 참조하십시오. 이 기본 파일은 JDK 버전에 따라 다를 수 있습니다.
            파일을 지정하지 않으면 플러그인은 <code>jpackage</code>가 제공하는 기본 권한을 사용합니다. 자세한 내용은
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS용 배포판 서명 및 공증</a> 튜토리얼을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>runtimeEntitlementsFile.set(File("PATH_R_ENT"))</code></td>
        <td>
            JVM 런타임 서명 시 사용되는 권한이 포함된 파일의 경로를 지정합니다. 사용자 지정 파일을 제공할 때, 
            Java 애플리케이션에 필요한 권한을 추가해야 합니다. App Store용으로 빌드할 때 사용되는 기본 파일은 
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>를 참조하십시오. 이 기본 파일은 JDK 버전에 따라 다를 수 있습니다.
            파일을 지정하지 않으면 플러그인은 <code>jpackage</code>가 제공하는 기본 권한을 사용합니다. 자세한 내용은
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS용 배포판 서명 및 공증</a> 튜토리얼을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>dmgPackageVersion = "DMG_VERSION"</code></td>
        <td>
            DMG 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>pkgPackageVersion = "PKG_VERSION"</code></td>
        <td>
            PKG 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>packageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            패키지 빌드 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>dmgPackageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            DMG 특정 패키지 빌드 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>pkgPackageBuildVersion = "PKG_VERSION"</code></td>
        <td>
            PKG 특정 패키지 빌드 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.
        </td>
</tr>

    
<tr>
<td><code>infoPlist</code></td>
        <td><a href="#information-property-list-on-macos">macOS의 <code>Info.plist</code></a> 섹션을 참조하십시오.</td>
</tr>

        
<tr>
<td rowspan="7">Windows</td>
            <td><code>console = true</code></td>
            <td>애플리케이션에 콘솔 런처를 추가합니다.</td>
</tr>

        
<tr>
<td><code>dirChooser = true</code></td>
            <td>설치 중 설치 경로 사용자 지정을 활성화합니다.</td>
</tr>

        
<tr>
<td><code>perUserInstall = true</code></td>
            <td>애플리케이션을 사용자별로 설치하는 것을 활성화합니다.</td>
</tr>

        
<tr>
<td><code>menuGroup = "start-menu-group"</code></td>
            <td>지정된 시작 메뉴 그룹에 애플리케이션을 추가합니다.</td>
</tr>

        
<tr>
<td><code>upgradeUuid = "UUID"</code></td>
            <td>사용자가 설치된 버전보다 최신 버전이 있을 때 설치 프로그램을 통해 애플리케이션을 업데이트할 수 있도록 하는 고유 ID를 지정합니다. 
            이 값은 단일 애플리케이션에 대해 일정하게 유지되어야 합니다. 
            자세한 내용은 <a href="https://wixtoolset.org/documentation/manual/v3/howtos/general/generate_guids.html">How To: GUID 생성</a>을 참조하십시오.</td>
</tr>

        
<tr>
<td><code>msiPackageVersion = "MSI_VERSION"</code></td>
            <td>MSI 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.</td>
</tr>

        
<tr>
<td><code>exePackageVersion = "EXE_VERSION"</code></td>
            <td>EXE 특정 패키지 버전을 설정합니다. 자세한 내용은 <a href="#package-version">패키지 버전</a> 섹션을 참조하십시오.</td>
</tr>

</table>

## macOS별 구성

### macOS에서 서명 및 공증

최신 macOS 버전은 인터넷에서 다운로드한 서명되지 않은 애플리케이션의 실행을 허용하지 않습니다. 이러한 애플리케이션을 실행하려고 하면
다음과 같은 오류가 발생합니다: "YourApp is damaged and can't be open. You should eject the disk image" (YourApp이 손상되어 열 수 없습니다. 디스크 이미지를 추출해야 합니다).

애플리케이션을 서명하고 공증하는 방법은 [튜토리얼](https://github.com/JetBrains/compose-multiplatform/blob/master/tutorials/Signing_and_notarization_on_macOS/README.md)을 참조하십시오.

### macOS의 정보 속성 목록

DSL은 필수적인 플랫폼별 사용자 지정을 지원하지만, 제공되는 기능을 넘어설 수 있는 경우가 여전히 있을 수 있습니다.
DSL에 표현되지 않은 `Info.plist` 값을 지정해야 하는 경우,
원시 XML 스니펫을 해결 방법으로 포함할 수 있습니다. 이 XML은 애플리케이션의 `Info.plist`에 추가됩니다.

#### 예시: 딥 링크

1.  `build.gradle.kts` 파일에 사용자 지정 URL 스키마를 정의합니다.

  ``` kotlin
  compose.desktop {
      application {
          mainClass = "MainKt"
          nativeDistributions {
              targetFormats(TargetFormat.Dmg)
              packageName = "Deep Linking Example App"
              macOS {
                  bundleID = "org.jetbrains.compose.examples.deeplinking"
                  infoPlist {
                      extraKeysRawXml = macExtraPlistKeys
                  }
              }
          }
      }
  }
  
  val macExtraPlistKeys: String
      get() = """
        <key>CFBundleURLTypes</key>
        <array>
          <dict>
            <key>CFBundleURLName</key>
            <string>Example deep link</string>
            <key>CFBundleURLSchemes</key>
            <array>
              <string>compose</string>
            </array>
          </dict>
        </array>
      """
  ```
  {initial-collapse-state="collapsed" collapsible="true" collapsed-title="infoPlist { extraKeysRawXml = macExtraPlistKeys"}

2.  `src/main/main.kt` 파일에서 `java.awt.Desktop` 클래스를 사용하여 URI 핸들러를 설정합니다.

  ``` kotlin 
  import androidx.compose.material.MaterialTheme
  import androidx.compose.material.Text
  import androidx.compose.runtime.getValue
  import androidx.compose.runtime.mutableStateOf
  import androidx.compose.runtime.setValue
  import androidx.compose.ui.window.singleWindowApplication
  import java.awt.Desktop
  
  fun main() {
      var text by mutableStateOf("Hello, World!")
  
      try {
          Desktop.getDesktop().setOpenURIHandler { event ->
              text = "Open URI: " + event.uri
          }
      } catch (e: UnsupportedOperationException) {
          println("setOpenURIHandler is unsupported")
      }
  
      singleWindowApplication {
          MaterialTheme {
              Text(text)
          }
      }
  }
  ```
  {initial-collapse-state="collapsed" collapsible="true" collapsed-title="Desktop.getDesktop().setOpenURIHandler { event ->"}

3.  `runDistributable` 태스크를 실행합니다: `./gradlew runDistributable`.

결과적으로 `compose://foo/bar`와 같은 링크는 이제 브라우저에서 애플리케이션으로 리디렉션될 수 있습니다.

## 코드 압축 및 난독화

Compose Multiplatform Gradle 플러그인에는 [ProGuard](https://www.guardsquare.com/proguard)에 대한 내장 지원이 포함되어 있습니다.
ProGuard는 코드 압축 및 난독화를 위한 [오픈 소스 도구](https://github.com/Guardsquare/proguard)입니다.

각 *기본* (ProGuard 없음) 패키징 태스크에 대해 Gradle 플러그인은 *릴리스* (ProGuard 포함) 태스크를 제공합니다.

<table>
  
<tr>
<td width="400">Gradle 태스크</td>
    <td>설명</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>createDistributable</code></p>
        <p>릴리스: <code>createReleaseDistributable</code></p>
    </td>
    <td>번들된 JDK 및 리소스를 사용하여 애플리케이션 이미지를 생성합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>runDistributable</code></p>
        <p>릴리스: <code>runReleaseDistributable</code></p>
    </td>
    <td>번들된 JDK 및 리소스를 사용하여 애플리케이션 이미지를 실행합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>run</code></p>
        <p>릴리스: <code>runRelease</code></p>
    </td>
    <td>Gradle JDK를 사용하여 비패키지 애플리케이션 <code>.jar</code>를 실행합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>package&lt;FORMAT_NAME&gt;</code></p>
        <p>릴리스: <code>packageRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>애플리케이션 이미지를 <code>&lt;FORMAT_NAME&gt;</code> 파일로 패키징합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>packageDistributionForCurrentOS</code></p>
        <p>릴리스: <code>packageReleaseDistributionForCurrentOS</code></p>
    </td>
    <td>애플리케이션 이미지를 현재 OS와 호환되는 형식으로 패키징합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>packageUberJarForCurrentOS</code></p>
        <p>릴리스: <code>packageReleaseUberJarForCurrentOS</code></p>
    </td>
    <td>애플리케이션 이미지를 우버 (팻) <code>.jar</code>로 패키징합니다.</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>notarize&lt;FORMAT_NAME&gt;</code></p>
        <p>릴리스: <code>notarizeRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>공증을 위해 <code>&lt;FORMAT_NAME&gt;</code> 애플리케이션 이미지를 업로드합니다 (macOS 전용).</td>
</tr>

  
<tr>
<td>
        <p>기본: <code>checkNotarizationStatus</code></p>
        <p>릴리스: <code>checkReleaseNotarizationStatus</code></p>
    </td>
    <td>공증 성공 여부를 확인합니다 (macOS 전용).</td>
</tr>

</table>

기본 구성은 미리 정의된 일부 ProGuard 규칙을 활성화합니다.

*   애플리케이션 이미지는 코드 압축되어 사용되지 않는 클래스가 제거됩니다.
*   `compose.desktop.application.mainClass`가 진입점으로 사용됩니다.
*   Compose 런타임이 계속 작동하도록 여러 `keep` 규칙이 포함됩니다.

대부분의 경우, 압축된 애플리케이션을 얻기 위해 추가 구성은 필요하지 않습니다.
그러나 ProGuard는 리플렉션을 통해 클래스가 사용되는 경우와 같이 특정 사용을 바이트코드에서 추적하지 못할 수 있습니다.
ProGuard 처리 후에만 발생하는 문제가 발생하면 사용자 지정 규칙을 추가해야 할 수 있습니다.

사용자 지정 구성 파일을 지정하려면 다음과 같이 DSL을 사용하십시오.

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            configurationFiles.from(project.file("compose-desktop.pro"))
        }
    }
}
```

ProGuard 규칙 및 구성 옵션에 대한 자세한 내용은 Guardsquare [매뉴얼](https://www.guardsquare.com/manual/configuration/usage)을 참조하십시오.

난독화는 기본적으로 비활성화되어 있습니다. 활성화하려면 Gradle DSL을 통해 다음 속성을 설정하십시오.

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            obfuscate.set(true)
        }
    }
}
```

ProGuard의 최적화는 기본적으로 활성화되어 있습니다. 비활성화하려면 Gradle DSL을 통해 다음 속성을 설정하십시오.

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            optimize.set(false)
        }
    }
}
```

우버 JAR 생성은 기본적으로 비활성화되어 있으며, ProGuard는 각 입력 `.jar`에 대해 해당하는 `.jar` 파일을 생성합니다. 활성화하려면 Gradle DSL을 통해 다음 속성을 설정하십시오.

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            joinOutputJars.set(true)
        }
    }
}
```

## 다음 단계는?

[데스크톱 구성 요소](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보십시오.