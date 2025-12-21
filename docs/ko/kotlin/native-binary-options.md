[//]: # (title: Kotlin/Native 바이너리 옵션)

이 페이지에서는 Kotlin/Native [최종 바이너리](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)를 구성하는 데 사용할 수 있는 유용한 Kotlin/Native 바이너리 옵션과 프로젝트에서 바이너리 옵션을 설정하는 방법을 나열합니다.

## 활성화 방법

바이너리 옵션을 `gradle.properties` 파일, 빌드 파일 또는 컴파일러 인수로 활성화할 수 있습니다.

### Gradle 속성에서

프로젝트의 `gradle.properties` 파일에서 `kotlin.native.binary` 속성을 사용하여 바이너리 옵션을 설정할 수 있습니다. 예를 들어:

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### 빌드 파일에서

`build.gradle.kts` 파일에서 프로젝트의 바이너리 옵션을 설정할 수 있습니다:

* `binaryOption` 속성을 사용하여 특정 바이너리에 대해 설정할 수 있습니다. 예를 들어:

  ```kotlin
  kotlin {
      iosArm64 {
          binaries {
              framework {
                  binaryOption("smallBinary", "true")
              }
          }
      }
  }
  ```

* `freeCompilerArgs` 속성에서 `-Xbinary=$option=$value` 컴파일러 옵션으로 설정할 수 있습니다. 예를 들어:

  ```kotlin
  kotlin {
      iosArm64 {
          compilations.configureEach {
              compilerOptions.configure {
                  freeCompilerArgs.add("-Xbinary=smallBinary=true")
              }
          }
      }
  }
  ```

### 명령줄 컴파일러에서

[Kotlin/Native 컴파일러](native-get-started.md#using-the-command-line-compiler)를 실행할 때 명령줄에서 `-Xbinary=$option=$value`로 바이너리 옵션을 직접 전달할 수 있습니다. 예를 들어:

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## 바이너리 옵션

> 이 표는 모든 기존 옵션의 포괄적인 목록이 아니며, 가장 주목할 만한 옵션만 포함되어 있습니다.
>
{style="note"}

<table column-width="fixed">
    <tr>
        <td width="240">옵션</td>
        <td width="170">값</td>
        <td>설명</td>
        <td width="110">상태</td>
    </tr>
    <tr>
        <td><a href="native-objc-interop.md#explicit-parameter-names-in-objective-c-block-types"><code>objcExportBlockExplicitParameterNames</code></a></td>
        <td>
            <list>
                <li><code>true</code> (기본값)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>내보낸 Objective-C 헤더의 함수 타입에 명시적 매개변수 이름을 추가합니다.</td>
        <td>2.3.0부터 기본값</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (기본값)</li>
            </list>
        </td>
        <td>릴리스 바이너리의 바이너리 크기를 줄입니다.</td>
        <td>2.2.20부터 실험적</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (기본값)</li>
            </list>
        </td>
        <td>스택 카나리(stack canaries)를 활성화합니다. 취약한 함수에는 <code>yes</code>를 사용하고, 모든 함수에는 <code>all</code>을, 더 강력한 휴리스틱을 사용하려면 <code>strong</code>을 사용합니다.</td>
        <td>2.2.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (기본값)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>할당 페이징(버퍼링)을 제어합니다. <code>false</code>인 경우, 메모리 할당자는 객체별로 메모리를 예약합니다.</td>
        <td>2.2.0부터 실험적</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (기본값)</li>
            </list>
        </td>
        <td>애플리케이션 바이너리 크기를 줄이고 메모리 소비를 조정하기 위해 Latin-1 인코딩된 문자열 지원을 제어합니다.</td>
        <td>2.2.0부터 실험적</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>메모리 태그 지정을 제어하며, Apple 플랫폼에서 메모리 소비 추적에 필요합니다. <code>240</code>-<code>255</code> 값이 사용 가능하며 (기본값은 <code>246</code>), <code>0</code>은 태그 지정을 비활성화합니다.</td>
        <td>2.2.0부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (기본값)</li>
            </list>
        </td>
        <td>기본 할당자를 제어합니다. <code>true</code>인 경우, <code>mmap</code> 대신 <code>malloc</code> 메모리 할당자를 사용합니다.</td>
        <td>2.2.0부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>gc</code></td>
        <td>
            <list>
                <li><code>pmcs</code> (기본값)</li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#optimize-gc-performance"><code>cms</code></a></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>가비지 컬렉션 동작을 제어합니다:
            <list>
                <li><code>pmcs</code>는 병렬 마크 동시 스윕(parallel mark concurrent sweep)을 사용합니다</li>
                <li><code>stwms</code>는 간단한 스톱-더-월드 마크 앤 스윕(simple stop-the-world mark and sweep)을 사용합니다</li>
                <li><code>cms</code>는 GC 일시 중지 시간을 줄이는 데 도움이 되는 동시 마킹을 활성화합니다</li>
                <li><code>noop</code>는 가비지 컬렉션을 비활성화합니다</li>
            </list>
        </td>
        <td><code>cms</code>는 2.0.20부터 실험적</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (기본값)</li>
            </list>
        </td>
        <td>가비지 컬렉션의 마크 단계 병렬화를 비활성화합니다. 대규모 힙에서 GC 일시 중지 시간을 증가시킬 수 있습니다.</td>
        <td>1.7.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (기본값)</li>
            </list>
        </td>
        <td>Xcode Instruments에서 디버깅하기 위해 프로젝트에서 GC 관련 일시 중지를 추적할 수 있도록 활성화합니다.</td>
        <td>2.0.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>실제 코드 생성 단계 이전에 수행되는 Kotlin IR 컴파일러의 인라이닝 최적화 패스를 구성합니다(기본적으로 비활성화됨).</p> 
            <p>권장되는 토큰 수(컴파일러가 파싱하는 코드 단위)는 40입니다.</p>
        </td>
        <td>2.1.20부터 실험적</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (기본값)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>Swift/Objective-C 객체의 초기화 해제(deinitialization)를 제어합니다. <code>false</code>인 경우, 초기화 해제는 메인 스레드 대신 특수 GC 스레드에서 발생합니다.</td>
        <td>1.9.0부터 사용 가능</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (기본값)</li>
            </list>
        </td>
        <td>
            <p>애플리케이션이 백그라운드에서 실행될 때 타이머 기반으로 가비지 컬렉터 호출을 제어합니다.</p>
            <p><code>enabled</code>인 경우, GC는 메모리 소비가 너무 높아질 때만 호출됩니다.</p>
       </td>
        <td>1.7.20부터 실험적</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code> 파일에서 번들 ID(<code>CFBundleIdentifier</code>)를 설정합니다.</td>
        <td>1.7.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code> 파일에서 짧은 번들 버전(<code>CFBundleShortVersionString</code>)을 설정합니다.</td>
        <td>1.7.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code> 파일에서 번들 버전(<code>CFBundleVersion</code>)을 설정합니다.</td>
        <td>1.7.20부터 사용 가능</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Apple 타겟)</li>
                <li><code>noop</code> (기본값)</li>
            </list>
        </td>
        <td>
            <p>예외 스택 트레이스에 파일 위치와 줄 번호를 추가합니다.</p>
            <p><code>coresymbolication</code>은 Apple 타겟에서만 사용할 수 있으며 디버그 모드의 macOS 및 Apple 시뮬레이터에서는 기본적으로 활성화됩니다.</p>
        </td>
        <td>1.6.20부터 실험적</td>
    </tr>
    <!-- <tr>
        <td><code>objcExportReportNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>enabled</code>, reports warnings in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>objcExportErrorOnNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>true</code>, issues errors in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>debugCompilationDir</code></td>
        <td><code>String</code></td>
        <td>Specifies the directory path to use for debug information in the compiled binary.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>fixedBlockPageSize</code></td>
        <td><code>UInt</code></td>
        <td>Controls the page size for fixed memory blocks in the memory allocator. Affects memory allocation performance and fragmentation.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>gcMutatorsCooperate</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Controls cooperation between mutator threads and the garbage collector.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>auxGCThreads</code></td>
        <td><code>UInt</code></td>
        <td>Specifies the number of auxiliary threads to use for garbage collection.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>sanitizer</code></td>
        <td>
            <list>
                <li><code>address</code></li>
                <li><code>thread</code></li>
            </list>
        </td>
        <td>Enables runtime sanitizers for detecting various issues like memory errors, data races, and undefined behavior.</td>
        <td>Experimental</td>
    </tr> -->
</table>

> 안정성 수준에 대한 자세한 내용은 [문서](components-stability.md#stability-levels-explained)를 참조하십시오.
> 
{style="tip"}

## 다음 단계

[최종 네이티브 바이너리를 빌드하는 방법](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)을 알아보세요.