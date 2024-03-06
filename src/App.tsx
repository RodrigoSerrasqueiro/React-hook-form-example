import './styles/global.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserFormSchema = z.object({
  name: z.string()
    .min(1, 'O nome é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  age: z.string()
    .min(1, 'A idade é obrigatória.')
    .transform(age => {
      return parseInt(age)
    }),
  email: z.string()
    .min(1, 'O e-mail é obrigatório.')
    .email('O formato do e-mail informado é inválido.')
    .refine(email => {
      return email.endsWith('@gmail.com')
      //o método refine é usado para adicionar validações que não são fornecidas pelo zod como padrão. Basta retornar true ou false, podendo passar uma mensagem como parâmetro.
    }, 'O e-mail precisar ser do gmail.'),
  password: z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
    .min(1, 'Confirme a sua senha.')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas precisam ser iguais',
  path: ['confirmPassword']
});

export function App() {

  const { 
    register,
    handleSubmit, 
    formState: { errors } 
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createuser(data: CreateUserFormData) {
    console.log(data);
  }

  type CreateUserFormData = z.infer<typeof createUserFormSchema>

  return (
    <main className='h-screen bg-zinc-50 flex items-center justify-center'>
      <form 
        onSubmit={handleSubmit(createuser)} 
        className='flex flex-col gap-4 w-full max-w-xs'
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor='name'>Nome</label>
          <input 
            type='text' 
            className={`border border-zinc-200 shadow-sm rounded h-10 px-3 ${errors.name ? ' outline-red-500' : ' outline-emerald-500'}`}
            {...register('name')}
          />
          {errors.name && <span className='text-red-600'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='age'>Idade</label>
          <input 
            type='number' 
            className={`border border-zinc-200 shadow-sm rounded h-10 px-3 ${errors.age ? ' outline-red-500' : ' outline-emerald-500'}`}
            {...register('age')}
          />
          {errors.age && <span className='text-red-600'>{errors.age.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email'>E-mail</label>
          <input 
            type='email' 
            className={`border border-zinc-200 shadow-sm rounded h-10 px-3 ${errors.email ? ' outline-red-500' : ' outline-emerald-500'}`}
            {...register('email')}
          />
          {errors.email && <span className='text-red-600'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='password'>Senha</label>
          <input 
            type='password' 
            className={`border border-zinc-200 shadow-sm rounded h-10 px-3 ${errors.password ? ' outline-red-500' : ' outline-emerald-500'}`}
            {...register('password')}
          />
          {errors.password && <span className='text-red-600'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='confirmPassword'>Confirme sua senha</label>
          <input 
            type='password' 
            className={`border border-zinc-200 shadow-sm rounded h-10 px-3 ${errors.password ? ' outline-red-500' : ' outline-emerald-500'}`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <span className='text-red-600'>{errors.confirmPassword.message}</span>}
        </div>

        <button 
          type='submit'
          className='bg-emerald-500 rounded font-semibold h-10 text-white outline-emerald-200 hover:bg-emerald-600'
        >
          Salvar
        </button>
      </form>
    </main>
  )
}