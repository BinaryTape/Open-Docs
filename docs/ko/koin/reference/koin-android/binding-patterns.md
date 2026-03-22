---
title: Android 라이브러리 통합
---

이 가이드는 일반적인 Android 라이브러리를 Koin과 통합하는 방법을 다룹니다.

:::info
핵심 정의 유형 및 외부 라이브러리 바인딩 패턴에 대해서는 [정의(Definitions)](/docs/reference/koin-core/definitions)를 참고하세요. 이 페이지는 Android 전용 라이브러리 예제에 초점을 맞춥니다.
:::

## Retrofit

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): User
}

// 빌더 함수 - Koin이 파라미터를 자동으로 해결합니다.
fun createOkHttpClient(): OkHttpClient =
    OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

fun createRetrofit(client: OkHttpClient): Retrofit =
    Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

fun createApiService(retrofit: Retrofit): ApiService =
    retrofit.create(ApiService::class.java)

val networkModule = module {
    single { create(::createOkHttpClient) }
    single { create(::createRetrofit) }
    single { create(::createApiService) }
}
```

또는 어노테이션(Annotations) 사용 시:

```kotlin
@Module
class NetworkModule {
    @Single
    fun provideOkHttpClient(): OkHttpClient =
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()

    @Single
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    @Single
    fun provideApiService(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## Room Database

```kotlin
@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}

fun createDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "app-database").build()

fun createUserDao(database: AppDatabase): UserDao = database.userDao()

val databaseModule = module {
    single { create(::createDatabase) }
    single { create(::createUserDao) }
}
```

또는 어노테이션 사용 시:

```kotlin
@Module
class DatabaseModule {
    @Single
    fun provideDatabase(context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "app-database").build()

    @Single
    fun provideUserDao(database: AppDatabase): UserDao = database.userDao()
}
```

## Gson / Serialization

```kotlin
fun createGson(): Gson =
    GsonBuilder()
        .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        .setPrettyPrinting()
        .create()

val serializationModule = module {
    single { create(::createGson) }
}
```

## WorkManager

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters,
    private val repository: SyncRepository
) : Worker(context, params) {

    override fun doWork(): Result {
        repository.sync()
        return Result.success()
    }
}

val workModule = module {
    workerOf(::SyncWorker)
}
```

:::note
WorkManager 설정을 위해 `koin-androidx-workmanager` 의존성을 사용하세요. 전체 설정은 [WorkManager 통합](/docs/reference/koin-android/workmanager)을 참고하세요.
:::

## Android Clean Architecture

### 리포지토리 패턴 (Repository Pattern)

```kotlin
@Singleton
class UserRemoteDataSource(private val api: ApiService)

@Singleton
class UserLocalDataSource(private val database: AppDatabase)

@Singleton
class UserRepositoryImpl(
    private val remoteDataSource: UserRemoteDataSource,
    private val localDataSource: UserLocalDataSource
) : UserRepository

// DSL
val dataModule = module {
    single<UserRemoteDataSource>()
    single<UserLocalDataSource>()
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

### 유스케이스 패턴 (Use Case Pattern)

```kotlin
@Factory
class GetUserUseCase(private val userRepository: UserRepository) {
    suspend operator fun invoke(userId: String): Result<User> = runCatching {
        userRepository.getUser(userId)
    }
}

val domainModule = module {
    factory<GetUserUseCase>()
}
```

### SavedStateHandle을 사용한 ViewModel

```kotlin
@KoinViewModel
class UserViewModel(
    private val getUserUseCase: GetUserUseCase,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val userId: String = savedStateHandle["userId"] ?: ""

    fun loadUser() {
        viewModelScope.launch {
            getUserUseCase(userId)
        }
    }
}

val viewModelModule = module {
    viewModel<UserViewModel>()
}
```

## 다음 단계

- **[정의(Definitions)](/docs/reference/koin-core/definitions)** - 핵심 정의 유형
- **[WorkManager](/docs/reference/koin-android/workmanager)** - 전체 WorkManager 설정
- **[Android 스코프(Scopes)](/docs/reference/koin-android/scope)** - 수명 주기 범위(Lifecycle-scoped) 인스턴스
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 주입 패턴