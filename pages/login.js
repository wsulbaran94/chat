import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import { login } from '../service/User/User'



const Login = () => {
	const router = useRouter();

    let schema = yup.object().shape({
        nickname: yup.string()
        .required('Nickname is required')
        .min(4, 'Nickname must be at least 4 characters'),
        password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
      });
    
    const formOptions = { resolver: yupResolver(schema)}
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return login(user)
            .then((success) => {
                if (success) {
                   router.push('dashboard');
                }
            })
            .catch((error) => console.warn(error));
    }

    return (
        <>
            <div className="bwm-form">
				<div className="row">
					<div className="col-md-4 mx-auto">
						<h1 className="page-title">Login</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="form-group">
								<label htmlFor="nickname">Nickname</label>
								<input
									type="text"
									className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
									name="nickname"
									{...register('nickname')}
									id="nickname" />
								<div className="invalid-feedback">
                                    {errors.nickname?.message}
                                </div>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input
									type="password"
									className={`form-control ${errors.password ? 'is-invalid' : ''}`}
									name="password"
									{...register('password')}
									id="password" />
								<div className="invalid-feedback">
                                    {errors.password?.message}
                                </div>
							</div>
							<h6>
								<a href='/register' className='return-a-login'>if you are not registered, click here.</a>
							</h6>
							<button
								type="submit"
								disabled={formState.isSubmitting}
								className="btn btn-main bg-blue py-2 ttu center-button">Sing In</button>
						</form>
					</div>
				</div>
			</div>
        </>
    )
}

export default Login;